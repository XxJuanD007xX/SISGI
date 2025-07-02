"use client"

import { AppSidebar } from "@/app/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useTheme } from "@/app/components/theme-provider"
import { Palette, Check, Settings, Moon, Bell, Shield, Database } from "lucide-react"

export default function ConfiguracionPage() {
  const { theme, setTheme } = useTheme()

  const handleThemeChange = (name: string) => {
    setTheme(name as any)
    if (typeof window !== "undefined") {
      const root = document.documentElement // <--- Cambia aquí
      root.classList.remove(
        "theme-default",
        "theme-green",
        "theme-purple",
        "theme-orange",
        "theme-red",
        "theme-blue"
      )
      root.classList.add(`theme-${name}`)
    }
  }

  const colorThemes = [
    {
      name: "default",
      label: "Azul Predeterminado",
      description: "Tema azul clásico y profesional",
      primary: "hsl(221, 83%, 53%)",
      secondary: "hsl(210, 40%, 95%)",
      accent: "hsl(210, 40%, 95%)",
    },
    {
      name: "green",
      label: "Verde Naturaleza",
      description: "Inspirado en la naturaleza y crecimiento",
      primary: "hsl(142, 76%, 36%)",
      secondary: "hsl(138, 76%, 97%)",
      accent: "hsl(138, 76%, 97%)",
    },
    {
      name: "purple",
      label: "Púrpura Elegante",
      description: "Sofisticado y moderno",
      primary: "hsl(262, 83%, 58%)",
      secondary: "hsl(270, 95%, 98%)",
      accent: "hsl(270, 95%, 98%)",
    },
    {
      name: "orange",
      label: "Naranja Energético",
      description: "Vibrante y dinámico",
      primary: "hsl(25, 95%, 53%)",
      secondary: "hsl(33, 100%, 96%)",
      accent: "hsl(33, 100%, 96%)",
    },
    {
      name: "red",
      label: "Rojo Corporativo",
      description: "Audaz y llamativo",
      primary: "hsl(0, 84%, 60%)",
      secondary: "hsl(0, 85%, 97%)",
      accent: "hsl(0, 85%, 97%)",
    },
    {
      name: "blue",
      label: "Azul Océano",
      description: "Tranquilo y confiable",
      primary: "hsl(200, 98%, 39%)",
      secondary: "hsl(204, 100%, 97%)",
      accent: "hsl(204, 100%, 97%)",
    },
  ]

  const configuraciones = [
    {
      titulo: "Notificaciones",
      descripcion: "Gestiona las alertas y notificaciones del sistema",
      icono: Bell,
      opciones: ["Email", "Push", "SMS"],
    },
    {
      titulo: "Seguridad",
      descripcion: "Configuración de seguridad y autenticación",
      icono: Shield,
      opciones: ["2FA", "Sesiones", "Contraseñas"],
    },
    {
      titulo: "Base de Datos",
      descripcion: "Configuración de respaldos y mantenimiento",
      icono: Database,
      opciones: ["Backup", "Limpieza", "Optimización"],
    },
  ]

  return (
    <div className="dark">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Configuración</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Configuración del Sistema</h1>
                <p className="text-muted-foreground">Personaliza la apariencia y configuración de SISGI</p>
              </div>
              <Badge variant="outline" className="w-fit">
                <Settings className="w-4 h-4 mr-2" />
                Configuración Avanzada
              </Badge>
            </div>

            {/* Theme Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Paleta de Colores
                </CardTitle>
                <CardDescription>
                  Selecciona una paleta de colores para personalizar la apariencia del dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {colorThemes.map((colorTheme) => (
                    <div
                      key={colorTheme.name}
                      className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                        theme === colorTheme.name ? "border-primary ring-2 ring-primary/20" : "border-border"
                      }`}
                      onClick={() => handleThemeChange(colorTheme.name)}
                    >
                      {theme === colorTheme.name && (
                        <div className="absolute top-2 right-2">
                          <div className="rounded-full bg-primary p-1">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <div
                            className="h-4 w-4 rounded-full border"
                            style={{ backgroundColor: colorTheme.primary }}
                          />
                          <div
                            className="h-4 w-4 rounded-full border"
                            style={{ backgroundColor: colorTheme.secondary }}
                          />
                          <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: colorTheme.accent }} />
                        </div>

                        <div>
                          <h3 className="font-medium">{colorTheme.label}</h3>
                          <p className="text-sm text-muted-foreground">{colorTheme.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Moon className="h-4 w-4" />
                    <span className="font-medium">Modo Oscuro Activo</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Todas las paletas están optimizadas para el modo oscuro
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Other Settings */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {configuraciones.map((config, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <config.icono className="h-5 w-5" />
                      {config.titulo}
                    </CardTitle>
                    <CardDescription>{config.descripcion}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {config.opciones.map((opcion, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded border">
                          <span className="text-sm">{opcion}</span>
                          <Button variant="outline" size="sm">
                            Configurar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* System Info */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Sistema</CardTitle>
                <CardDescription>Detalles técnicos y estado del sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Versión SISGI</p>
                    <p className="text-sm text-muted-foreground">v2.1.0</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Base de Datos</p>
                    <p className="text-sm text-muted-foreground">PostgreSQL 15.2</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Último Backup</p>
                    <p className="text-sm text-muted-foreground">Hace 2 horas</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Uptime</p>
                    <p className="text-sm text-muted-foreground">15 días, 4 horas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
