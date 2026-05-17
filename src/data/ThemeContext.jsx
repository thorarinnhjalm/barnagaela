import { useContext, useState, useEffect } from 'react';
import { ThemeContext } from './theme';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem('lulla-theme') || 'auto');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.remove('dark', 'light');
    }
    localStorage.setItem('lulla-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'auto') return 'dark';
      if (prev === 'dark') return 'light';
      return 'auto';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
