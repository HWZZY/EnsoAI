import { IPC_CHANNELS } from '@shared/types';
import { BrowserWindow, ipcMain, Notification } from 'electron';

interface NotificationOptions {
  title: string;
  body?: string;
  silent?: boolean;
  sessionId?: string;
}

export function registerNotificationHandlers(): void {
  ipcMain.handle(
    IPC_CHANNELS.NOTIFICATION_SHOW,
    async (event, options: NotificationOptions): Promise<void> => {
      if (!Notification.isSupported()) {
        return;
      }

      const notification = new Notification({
        title: options.title,
        body: options.body,
        silent: options.silent ?? false,
      });

      // 点击通知时激活窗口并通知渲染进程
      if (options.sessionId) {
        console.log('[Notification] 注册点击监听, sessionId:', options.sessionId);
        notification.on('click', () => {
          console.log('[Notification] 点击事件触发, sessionId:', options.sessionId);
          const window = BrowserWindow.fromWebContents(event.sender);
          if (window && !window.isDestroyed()) {
            // 激活窗口
            if (window.isMinimized()) window.restore();
            window.focus();
            // 通知渲染进程切换到对应 session
            console.log('[Notification] 发送 IPC 到渲染进程');
            window.webContents.send(IPC_CHANNELS.NOTIFICATION_CLICK, options.sessionId);
          } else {
            console.log('[Notification] 窗口不存在或已销毁');
          }
        });
      }

      notification.show();
    }
  );
}
