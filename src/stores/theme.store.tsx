import { create } from "zustand";

export type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const THEME_KEY = "click-eat-theme";

function getInitialTheme(): Theme {
  const saved = localStorage.getItem(THEME_KEY);
  return saved === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const isDark = theme === "dark";

  document.documentElement.classList.toggle("dark", isDark);
  document.body.classList.toggle("dark", isDark);

  document.documentElement.classList.toggle("dark-theme", isDark);
  document.body.classList.toggle("dark-theme", isDark);

  localStorage.setItem(THEME_KEY, theme);
}

const initialTheme = getInitialTheme();

applyTheme(initialTheme);

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: initialTheme,

  toggleTheme: () => {
    const nextTheme = get().theme === "light" ? "dark" : "light";
    applyTheme(nextTheme);
    set({ theme: nextTheme });
  },

  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
}));