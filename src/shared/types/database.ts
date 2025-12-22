export interface DatabaseQueryResult<T = unknown> {
  rows: T[];
  changes?: number;
  lastInsertRowid?: number | bigint;
}

export interface WorkspaceRecord {
  id: number;
  name: string;
  path: string;
  created_at: string;
  updated_at: string;
}

export interface SessionRecord {
  id: number;
  workspace_id: number;
  agent_id: string;
  messages: string; // JSON string
  created_at: string;
  updated_at: string;
}

export interface SettingRecord {
  key: string;
  value: string; // JSON string
}
