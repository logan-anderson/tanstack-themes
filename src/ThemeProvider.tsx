import { createContext, useContext, useEffect, useState } from "react";
import { ThemeMode } from "./schemas";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
  storageKey?: string;
  updateThemeCookie: ({ data }: { data: ThemeMode }) => void;
};

type ThemeProviderState = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  updateThemeCookie,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(storageKey) as ThemeMode) || defaultTheme;
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: ThemeMode) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
      updateThemeCookie({ data: theme });
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
