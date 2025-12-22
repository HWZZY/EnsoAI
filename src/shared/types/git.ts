export interface GitStatus {
  isClean: boolean;
  current: string | null;
  tracking: string | null;
  ahead: number;
  behind: number;
  staged: string[];
  modified: string[];
  deleted: string[];
  untracked: string[];
  conflicted: string[];
}

export interface GitBranch {
  name: string;
  current: boolean;
  commit: string;
  label: string;
}

export interface GitLogEntry {
  hash: string;
  date: string;
  message: string;
  author_name: string;
  author_email: string;
  refs?: string;
}

export interface GitWorktree {
  path: string;
  head: string;
  branch: string | null;
  isMainWorktree: boolean;
  isLocked: boolean;
  prunable: boolean;
}
