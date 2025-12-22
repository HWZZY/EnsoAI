import { cn } from '@/lib/utils';
import {
  GitBranchIcon,
  MessageSquareIcon,
  FolderIcon,
  GitCommitIcon,
  SettingsIcon,
} from './Icons';

type TabId = 'worktrees' | 'chat' | 'files' | 'git' | 'settings';

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: Array<{ id: TabId; label: string; icon: React.ElementType; shortcut: string }> = [
  { id: 'worktrees', label: 'Worktrees', icon: GitBranchIcon, shortcut: '⌘1' },
  { id: 'chat', label: 'Chat', icon: MessageSquareIcon, shortcut: '⌘2' },
  { id: 'files', label: 'Files', icon: FolderIcon, shortcut: '⌘3' },
  { id: 'git', label: 'Git', icon: GitCommitIcon, shortcut: '⌘4' },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, shortcut: '⌘,' },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="flex w-16 flex-col items-center border-r bg-muted/30 py-4">
      {/* Traffic light spacer for macOS */}
      <div className="h-8 drag-region" />

      {/* Navigation */}
      <nav className="flex flex-1 flex-col items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg transition-colors no-drag',
              activeTab === tab.id
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
            title={`${tab.label} (${tab.shortcut})`}
          >
            <tab.icon className="h-5 w-5" />
          </button>
        ))}
      </nav>
    </aside>
  );
}
