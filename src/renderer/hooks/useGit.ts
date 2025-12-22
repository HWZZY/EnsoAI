import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRepositoryStore } from '@/stores/repository';

export function useGitStatus(workdir: string | null) {
  const setStatus = useRepositoryStore((s) => s.setStatus);

  return useQuery({
    queryKey: ['git', 'status', workdir],
    queryFn: async () => {
      if (!workdir) return null;
      const status = await window.electronAPI.git.getStatus(workdir);
      setStatus(status);
      return status;
    },
    enabled: !!workdir,
    refetchInterval: 5000,
  });
}

export function useGitBranches(workdir: string | null) {
  const setBranches = useRepositoryStore((s) => s.setBranches);

  return useQuery({
    queryKey: ['git', 'branches', workdir],
    queryFn: async () => {
      if (!workdir) return [];
      const branches = await window.electronAPI.git.getBranches(workdir);
      setBranches(branches);
      return branches;
    },
    enabled: !!workdir,
  });
}

export function useGitLog(workdir: string | null, maxCount = 50) {
  const setLogs = useRepositoryStore((s) => s.setLogs);

  return useQuery({
    queryKey: ['git', 'log', workdir, maxCount],
    queryFn: async () => {
      if (!workdir) return [];
      const logs = await window.electronAPI.git.getLog(workdir, maxCount);
      setLogs(logs);
      return logs;
    },
    enabled: !!workdir,
  });
}

export function useGitCommit(workdir: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ message, files }: { message: string; files?: string[] }) => {
      return window.electronAPI.git.commit(workdir, message, files);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['git', 'status', workdir] });
      queryClient.invalidateQueries({ queryKey: ['git', 'log', workdir] });
    },
  });
}

export function useGitCheckout(workdir: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (branch: string) => {
      await window.electronAPI.git.checkout(workdir, branch);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['git', 'status', workdir] });
      queryClient.invalidateQueries({ queryKey: ['git', 'branches', workdir] });
    },
  });
}
