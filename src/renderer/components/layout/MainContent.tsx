import type { WorkspaceRecord } from '@shared/types';

type TabId = 'worktrees' | 'chat' | 'files' | 'git' | 'settings';

interface MainContentProps {
  activeTab: TabId;
  workspace: WorkspaceRecord | null;
}

export function MainContent({ activeTab, workspace }: MainContentProps) {
  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      {/* Header with drag region */}
      <header className="flex h-12 items-center border-b px-4 drag-region">
        <h1 className="text-sm font-medium no-drag">
          {workspace?.name || 'No Workspace Selected'}
        </h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'worktrees' && <WorktreesPlaceholder />}
        {activeTab === 'chat' && <ChatPlaceholder />}
        {activeTab === 'files' && <FilesPlaceholder />}
        {activeTab === 'git' && <GitPlaceholder />}
        {activeTab === 'settings' && <SettingsPlaceholder />}
      </div>
    </main>
  );
}

function WorktreesPlaceholder() {
  return (
    <div className="flex h-full items-center justify-center text-muted-foreground">
      <p>Worktrees view - Coming soon</p>
    </div>
  );
}

function ChatPlaceholder() {
  return (
    <div className="flex h-full items-center justify-center text-muted-foreground">
      <p>Chat view - Coming soon</p>
    </div>
  );
}

function FilesPlaceholder() {
  return (
    <div className="flex h-full items-center justify-center text-muted-foreground">
      <p>Files view - Coming soon</p>
    </div>
  );
}

function GitPlaceholder() {
  return (
    <div className="flex h-full items-center justify-center text-muted-foreground">
      <p>Git view - Coming soon</p>
    </div>
  );
}

function SettingsPlaceholder() {
  return (
    <div className="flex h-full items-center justify-center text-muted-foreground">
      <p>Settings view - Coming soon</p>
    </div>
  );
}
