"use client"

import * as React from "react"

type Theme = "default" | "blue" | "green" | "purple" | "red" | "slate" | "stone" | "rose" | "cyan"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "default",
  setTheme: () => null,
}

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children, defaultTheme = "default", ...props }: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme)

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("sisgi-theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  React.useEffect(() => {
    const root = document.documentElement
    // Limpiamos clases de temas anteriores
    const themeClasses = [
      "theme-default",
      "theme-blue",
      "theme-green",
      "theme-purple",
      "theme-red",
      "theme-slate",
      "theme-stone",
      "theme-rose",
      "theme-cyan"
    ]
    root.classList.remove(...themeClasses)

    // Agregamos la clase del tema actual y lo guardamos
    if (theme) {
      root.classList.add(`theme-${theme}`)
      localStorage.setItem("sisgi-theme", theme)
    }
  }, [theme])

  const value = {
    theme,
    setTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
