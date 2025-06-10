"use client"

import { useTheme } from "@/app/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Palette } from "lucide-react"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  // Cicla entre los temas disponibles
  const cycleTheme = () => {
    const themes = ["default", "blue", "green", "purple", "orange", "red"]
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex] as any)
  }

  return (
    <Button variant="outline" size="icon" onClick={cycleTheme} title="Cambiar tema">
      <Palette className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Cambiar tema</span>
    </Button>
  )
}
