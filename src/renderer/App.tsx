import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { MainContent } from './components/layout/MainContent';
import { useWorkspaceStore } from './stores/workspace';

type TabId = 'worktrees' | 'chat' | 'files' | 'git' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('worktrees');
  const { currentWorkspace } = useWorkspaceStore();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <MainContent activeTab={activeTab} workspace={currentWorkspace} />
    </div>
  );
}
