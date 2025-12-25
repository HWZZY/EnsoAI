import { createServer } from 'node:http';
import { electronApp, is, optimizer } from '@electron-toolkit/utils';
import { IPC_CHANNELS } from '@shared/types';
import { app, BrowserWindow, Menu } from 'electron';
import { cleanupAllResources, registerIpcHandlers } from './ipc';
import { checkGitInstalled } from './services/git/checkGit';
import { buildAppMenu } from './services/MenuBuilder';
import { autoUpdaterService } from './services/updater/AutoUpdater';
import { createMainWindow } from './windows/MainWindow';

let mainWindow: BrowserWindow | null = null;
let pendingOpenPath: string | null = null;

// Local HTTP server for CLI communication (works in dev mode too)
const CLI_SERVER_PORT = 21519;
function startCliServer(): void {
  const server = createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/open') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          const { path } = JSON.parse(body);
          console.log('[CliServer] Received open request:', path);
          if (path) {
            sendOpenPath(path);
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        } catch {
          res.writeHead(400);
          res.end('Invalid request');
        }
      });
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  server.listen(CLI_SERVER_PORT, '127.0.0.1', () => {
    console.log(`[CliServer] Listening on http://127.0.0.1:${CLI_SERVER_PORT}`);
  });

  server.on('error', (err) => {
    console.error('[CliServer] Failed to start:', err);
  });
}

// Register URL scheme handler (must be done before app is ready)
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('enso', process.execPath, [process.argv[1]]);
  }
} else {
  app.setAsDefaultProtocolClient('enso');
}

// Parse URL and extract path
function parseEnsoUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'enso:') {
      const path = parsed.searchParams.get('path');
      if (path) {
        return decodeURIComponent(path);
      }
    }
  } catch {
    // Invalid URL
  }
  return null;
}

// Send open path event to renderer
function sendOpenPath(path: string): void {
  console.log('[Main] sendOpenPath called with:', path);
  const windows = BrowserWindow.getAllWindows();
  if (windows.length > 0) {
    const win = windows[0];
    win.focus();
    // Check if renderer is ready (not loading)
    if (win.webContents.isLoading()) {
      // Store for later when page finishes loading
      console.log('[Main] Window still loading, storing pendingOpenPath');
      pendingOpenPath = path;
    } else {
      console.log('[Main] Sending APP_OPEN_PATH to renderer');
      win.webContents.send(IPC_CHANNELS.APP_OPEN_PATH, path);
    }
  } else {
    // Store for later when window is created
    console.log('[Main] No window yet, storing pendingOpenPath');
    pendingOpenPath = path;
  }
}

// Handle command line arguments
function handleCommandLineArgs(argv: string[]): void {
  console.log('[Main] Handling command line args:', argv);
  for (const arg of argv) {
    if (arg.startsWith('--open-path=')) {
      const path = arg.slice('--open-path='.length);
      console.log('[Main] Found --open-path:', path);
      if (path) {
        sendOpenPath(path);
      }
      return;
    }
    if (arg.startsWith('enso://')) {
      const path = parseEnsoUrl(arg);
      console.log('[Main] Found enso:// URL, parsed path:', path);
      if (path) {
        sendOpenPath(path);
      }
      return;
    }
  }
}

// macOS: Handle open-url event
app.on('open-url', (event, url) => {
  console.log('[Main] Received open-url event:', url);
  event.preventDefault();
  const path = parseEnsoUrl(url);
  console.log('[Main] Parsed path from URL:', path);
  if (path) {
    if (app.isReady()) {
      sendOpenPath(path);
    } else {
      pendingOpenPath = path;
    }
  }
});

// Windows/Linux: Handle second instance
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (_, commandLine) => {
    // Focus existing window
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
    // Handle command line from second instance
    handleCommandLineArgs(commandLine);
  });
}

async function init(): Promise<void> {
  // Check Git installation
  const gitInstalled = await checkGitInstalled();
  if (!gitInstalled) {
    console.warn('Git is not installed. Some features may not work.');
  }

  // Register IPC handlers
  registerIpcHandlers();
}

app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.ensoai.app');

  // Default open or close DevTools by F12 in development
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  await init();

  mainWindow = createMainWindow();

  // IMPORTANT: Set up did-finish-load handler BEFORE handling command line args
  // to avoid race condition where page loads before handler is registered
  mainWindow.webContents.once('did-finish-load', () => {
    console.log('[Main] did-finish-load fired, pendingOpenPath:', pendingOpenPath);
    if (pendingOpenPath) {
      console.log('[Main] Sending pending open path:', pendingOpenPath);
      mainWindow?.webContents.send(IPC_CHANNELS.APP_OPEN_PATH, pendingOpenPath);
      pendingOpenPath = null;
    }
  });

  // Initialize auto-updater
  autoUpdaterService.init(mainWindow);

  // Build and set application menu
  const menu = buildAppMenu(mainWindow, {
    onNewWindow: () => {
      createMainWindow();
    },
  });
  Menu.setApplicationMenu(menu);

  // Handle initial command line args (this may set pendingOpenPath)
  console.log('[Main] process.argv:', process.argv);
  handleCommandLineArgs(process.argv);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow();
    }
  });
});

app.on('window-all-closed', async () => {
  // Cleanup all resources before quitting
  await cleanupAllResources();
  app.quit();
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
