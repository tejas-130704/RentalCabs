'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'dark' : 'light')
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full border border-border bg-card opacity-50 shrink-0" />
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full flex items-center justify-center border border-border bg-card hover:bg-muted text-foreground transition-all duration-300 active:scale-95 cursor-pointer shrink-0"
      aria-label="Toggle light/dark theme"
    >
      {theme === 'dark' ? (
        <Sun size={18} className="text-accent" />
      ) : (
        <Moon size={18} className="text-primary" />
      )}
    </button>
  )
}
