import { create } from 'zustand';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  fontFamily: string;
  terminalFontSize: number;
  terminalFontFamily: string;

  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setFontSize: (size: number) => void;
  setFontFamily: (family: string) => void;
  setTerminalFontSize: (size: number) => void;
  setTerminalFontFamily: (family: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'dark',
  fontSize: 14,
  fontFamily: 'Inter',
  terminalFontSize: 14,
  terminalFontFamily: 'JetBrains Mono',

  setTheme: (theme) => set({ theme }),
  setFontSize: (fontSize) => set({ fontSize }),
  setFontFamily: (fontFamily) => set({ fontFamily }),
  setTerminalFontSize: (terminalFontSize) => set({ terminalFontSize }),
  setTerminalFontFamily: (terminalFontFamily) => set({ terminalFontFamily }),
}));
