
"use client";

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button";

export function ThemeToggleButton() {
  // Initialize state from localStorage or system preference after mount
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let initialTheme: 'light' | 'dark' = 'light';
    try {
      const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (storedTheme) {
        initialTheme = storedTheme;
      } else if (systemPrefersDark) {
        initialTheme = 'dark';
      }
    } catch (e) {
      // localStorage might be unavailable
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemPrefersDark) {
        initialTheme = 'dark';
      }
    }
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (!mounted) return; // Don't run on server or before initial client mount
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('theme', 'dark');
      } catch (e) {
        // localStorage might be unavailable
      }
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('theme', 'light');
      } catch (e) {
        // localStorage might be unavailable
      }
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  if (!mounted) {
    // Render a placeholder or null on the server/initial client render to avoid mismatch
    // For a button, it's often fine to render it disabled or with a default state
    // but to be perfectly safe and avoid flash of wrong icon:
    return <Button variant="outline" size="icon" disabled aria-label="Toggle theme"><Moon className="h-[1.2rem] w-[1.2rem]" /></Button>;
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
      {theme === 'light' ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
    </Button>
  );
}
