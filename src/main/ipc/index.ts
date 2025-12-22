import { registerGitHandlers } from './git';
import { registerWorktreeHandlers } from './worktree';
import { registerFileHandlers } from './files';
import { registerTerminalHandlers } from './terminal';
import { registerAgentHandlers } from './agent';
import { registerDatabaseHandlers } from './database';

export function registerIpcHandlers(): void {
  registerGitHandlers();
  registerWorktreeHandlers();
  registerFileHandlers();
  registerTerminalHandlers();
  registerAgentHandlers();
  registerDatabaseHandlers();
}
