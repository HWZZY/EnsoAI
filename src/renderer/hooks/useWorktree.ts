import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWorktreeStore } from '@/stores/worktree';
import type { WorktreeCreateOptions, WorktreeRemoveOptions } from '@shared/types';

export function useWorktreeList(workdir: string | null) {
  const setWorktrees = useWorktreeStore((s) => s.setWorktrees);

  return useQuery({
    queryKey: ['worktree', 'list', workdir],
    queryFn: async () => {
      if (!workdir) return [];
      const worktrees = await window.electronAPI.worktree.list(workdir);
      setWorktrees(worktrees);
      return worktrees;
    },
    enabled: !!workdir,
  });
}

export function useWorktreeAdd(workdir: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (options: WorktreeCreateOptions) => {
      await window.electronAPI.worktree.add(workdir, options);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worktree', 'list', workdir] });
    },
  });
}

export function useWorktreeRemove(workdir: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (options: WorktreeRemoveOptions) => {
      await window.electronAPI.worktree.remove(workdir, options);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worktree', 'list', workdir] });
    },
  });
}
