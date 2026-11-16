'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      setIsLight(true);
      document.documentElement.classList.add('light');
    }
  }, []);

  const toggleTheme = () => {
    if (isLight) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
      setIsLight(false);
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
      setIsLight(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark/light theme"
      className="p-2 rounded-lg text-zinc-400 hover:text-white dark:hover:text-zinc-100 transition-colors border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50"
    >
      {isLight ? <Moon className="w-4 h-4 text-zinc-800" /> : <Sun className="w-4 h-4 text-amber-400" />}
    </button>
  );
}
