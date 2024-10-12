import React, { useState, useEffect } from 'react';
import { setLocalStorage, getLocalStorage } from '@/services/storageServices';

const THEME = 'theme';
const DARK = 'dark';
const LIGHT = 'light';
const AUTO = 'auto';

export const ThemeContext = React.createContext({
  theme: AUTO,
  toggleTheme: () => {},
});

export const ThemeProvider = (props) => {
  const [theme, setTheme] = useState(getLocalStorage(THEME) ?? AUTO);

  useEffect(() => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
    const root = document.getElementsByTagName('html')[0];
    root.className = theme === AUTO ? systemTheme : theme;
  }, [theme]);

  const toggleTheme = () => {
    const getNextTheme = () => {
      switch (theme) {
        case DARK:
          return LIGHT;
        case LIGHT:
          return AUTO;
        default:
          return DARK;
      }
    };
    const nextTheme = getNextTheme();
    setTheme(nextTheme);
    setLocalStorage(THEME, nextTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
};
