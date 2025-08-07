"use client"

import * as React from "react"

type Theme = "default" | "blue" | "green" | "purple" | "orange" | "red"

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
  // 1. Inicializa el estado con el tema por defecto.
  //    Esto garantiza que el servidor y el navegador rendericen lo mismo la primera vez.
  const [theme, setTheme] = React.useState<Theme>(defaultTheme)

  // 2. Usamos un 'useEffect' para leer el tema del localStorage.
  //    Este código solo se ejecuta en el navegador, DESPUÉS del primer renderizado,
  //    evitando así el error de hidratación.
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("sisgi-theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, []) // El array vacío asegura que solo se ejecute una vez al montar el componente.

  React.useEffect(() => {
    // 3. Este segundo efecto se encarga de aplicar la clase al HTML
    //    y guardar en localStorage cada vez que el tema cambia.
    const root = document.documentElement
    // Limpiamos clases de temas anteriores
    root.classList.remove(
      "theme-default",
      "theme-green",
      "theme-purple",
      "theme-orange",
      "theme-red",
      "theme-blue"
    )
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