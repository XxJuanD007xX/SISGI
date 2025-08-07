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

  const colorThemes = [
    {
      name: "default",
      label: "SISGI Original",
      description: "Tema por defecto con tonos grises y acentos en magenta.",
      palette: ["hsl(240 10% 12%)", "hsl(240 5% 25%)", "hsl(344 100% 80%)", "hsl(344 100% 65%)", "hsl(344 100% 56%)"],
    },
     {
      name: "slate",
      label: "Grafito",
      description: "Un look neutro, moderno y minimalista.",
      palette: ["hsl(220 15% 12%)", "hsl(220 10% 25%)", "hsl(220 10% 50%)", "hsl(220 10% 70%)", "hsl(220 10% 90%)"],
    },
    {
      name: "stone",
      label: "Piedra",
      description: "Tonos tierra cálidos, orgánicos y profesionales.",
      palette: ["hsl(30 15% 12%)", "hsl(30 10% 25%)", "hsl(30 15% 45%)", "hsl(30 25% 65%)", "hsl(30 20% 90%)"],
    },
    {
      name: "red",
      label: "Fuego",
      description: "Una paleta de colores vibrante y enérgica.",
      palette: ["hsl(15 70% 12%)", "hsl(10 70% 25%)", "hsl(5 80% 45%)", "hsl(0 84% 60%)", "hsl(0 80% 80%)"],
    },
    {
      name: "green",
      label: "Bosque Nocturno",
      description: "Un tema sereno con verdes oscuros y profundos.",
      palette: ["hsl(142 80% 10%)", "hsl(142 75% 18%)", "hsl(142 70% 30%)", "hsl(142 76% 46%)", "hsl(142 70% 80%)"],
    },
    {
      name: "blue",
      label: "Azul Océano",
      description: "Una paleta tranquila y confiable inspirada en el océano.",
      palette: ["hsl(215 80% 12%)", "hsl(215 75% 22%)", "hsl(210 80% 35%)", "hsl(210 98% 59%)", "hsl(210 90% 80%)"],
    },
    {
      name: "purple",
      label: "Púrpura Elegante",
      description: "Un tema sofisticado y moderno en tonos púrpuras.",
      palette: ["hsl(262 80% 12%)", "hsl(262 75% 22%)", "hsl(262 70% 40%)", "hsl(262 83% 72%)", "hsl(262 80% 90%)"],
    },
     {
      name: "rose",
      label: "Rosa Cuarzo",
      description: "Un tema suave con un toque de elegancia y calidez.",
      palette: ["hsl(340 60% 12%)", "hsl(340 55% 25%)", "hsl(340 80% 45%)", "hsl(340 90% 65%)", "hsl(340 80% 90%)"],
    },
    {
      name: "cyan",
      label: "Cian neón",
      description: "Moderno y tecnológico, con un toque vibrante.",
      palette: ["hsl(190 80% 12%)", "hsl(185 75% 22%)", "hsl(180 80% 35%)", "hsl(180 90% 45%)", "hsl(180 80% 85%)"],
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
                      onClick={() => setTheme(colorTheme.name as any)}
                    >
                      {theme === colorTheme.name && (
                        <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                      <div className="space-y-3">
                        <div className="flex h-8 w-full items-center space-x-1 overflow-hidden rounded-md border">
                          {colorTheme.palette.map((color, index) => (
                            <div
                              key={index}
                              className="h-full w-full"
                              style={{ backgroundColor: color }}
                            />
                          ))}
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