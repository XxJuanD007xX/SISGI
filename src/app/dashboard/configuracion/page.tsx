"use client"

import { useState, useEffect } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Palette, Check, Settings, Moon, Bell, Shield, Database, Building, Save, Globe, Phone, Mail, MapPin } from "lucide-react"
import { toast } from "sonner"

export default function ConfiguracionPage() {
  const { theme, setTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [configData, setConfigData] = useState({
    nombreEmpresa: "",
    nit: "",
    direccion: "",
    telefono: "",
    email: "",
    sitioWeb: "",
    moneda: "COP"
  })

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/configuracion")
        if (response.ok) {
          const data = await response.json()
          if (data.id) setConfigData(data)
        }
      } catch (error) {
        console.error("Error al cargar configuración:", error)
      }
    }
    fetchConfig()
  }, [])

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:8080/api/configuracion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configData)
      })
      if (response.ok) {
        toast.success("Configuración guardada correctamente")
      } else {
        toast.error("Error al guardar la configuración")
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setConfigData(prev => ({ ...prev, [name]: value }))
  }

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
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background/80 backdrop-blur-md z-10">
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

          <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6 max-w-6xl mx-auto w-full">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Configuración del Sistema</h1>
                <p className="text-muted-foreground">Personaliza la apariencia y los datos corporativos de SISGI</p>
              </div>
              <Badge variant="outline" className="w-fit py-1.5 px-3">
                <Settings className="w-4 h-4 mr-2 text-primary" />
                Panel de Control
              </Badge>
            </div>

            <div className="grid gap-6">
              {/* Datos de la Empresa */}
              <Card className="border-2 border-primary/10 shadow-lg">
                <CardHeader className="bg-primary/5 border-b pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    Datos de la Empresa
                  </CardTitle>
                  <CardDescription>
                    Esta información aparecerá en los reportes PDF, órdenes de compra y facturación.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSaveConfig} className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nombreEmpresa" className="flex items-center gap-2">
                        <Building className="h-3.5 w-3.5 text-muted-foreground" /> Nombre Comercial
                      </Label>
                      <Input
                        id="nombreEmpresa"
                        name="nombreEmpresa"
                        placeholder="Ej: Variedades Dipal"
                        value={configData.nombreEmpresa}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nit" className="flex items-center gap-2">
                         <Shield className="h-3.5 w-3.5 text-muted-foreground" /> NIT / Identificación
                      </Label>
                      <Input
                        id="nit"
                        name="nit"
                        placeholder="Ej: 123.456.789-0"
                        value={configData.nit}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="direccion" className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> Dirección Física
                      </Label>
                      <Input
                        id="direccion"
                        name="direccion"
                        placeholder="Ej: Calle 10 #15-20, Bogotá"
                        value={configData.direccion}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono" className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" /> Teléfono de Contacto
                      </Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        placeholder="Ej: +57 300 123 4567"
                        value={configData.telefono}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Correo Electrónico
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Ej: contacto@dipal.com"
                        value={configData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sitioWeb" className="flex items-center gap-2">
                        <Globe className="h-3.5 w-3.5 text-muted-foreground" /> Sitio Web
                      </Label>
                      <Input
                        id="sitioWeb"
                        name="sitioWeb"
                        placeholder="Ej: www.variedadesdipal.com"
                        value={configData.sitioWeb}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end pt-2">
                      <Button type="submit" className="px-8" disabled={isLoading}>
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? "Guardando..." : "Guardar Información Corporativa"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Theme Selector */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    Personalización Visual
                  </CardTitle>
                  <CardDescription>
                    Selecciona una paleta de colores para el dashboard. Todos los temas están optimizados para modo oscuro.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {colorThemes.map((colorTheme) => (
                      <div
                        key={colorTheme.name}
                        className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md ${
                          theme === colorTheme.name ? "border-primary bg-primary/5 ring-4 ring-primary/10" : "border-border hover:border-muted-foreground/30"
                        }`}
                        onClick={() => setTheme(colorTheme.name as any)}
                      >
                        {theme === colorTheme.name && (
                          <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-sm">
                            <Check className="h-3.5 w-3.5 text-primary-foreground" />
                          </div>
                        )}
                        <div className="space-y-3">
                          <div className="flex h-10 w-full items-center space-x-1 overflow-hidden rounded-lg border shadow-inner bg-background/50">
                            {colorTheme.palette.map((color, index) => (
                              <div
                                key={index}
                                className="h-full w-full"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm">{colorTheme.label}</h3>
                            <p className="text-[11px] text-muted-foreground leading-tight mt-1">{colorTheme.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {configuraciones.map((config, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <config.icono className="h-5 w-5 text-primary" />
                        {config.titulo}
                      </CardTitle>
                      <CardDescription className="text-xs">{config.descripcion}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {config.opciones.map((opcion, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
                            <span className="text-sm font-medium">{opcion}</span>
                            <Button variant="ghost" size="sm" className="h-8 text-xs hover:bg-primary/10 hover:text-primary">
                              Gestionar
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* System Info */}
              <Card className="bg-muted/20 border-dashed">
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Settings className="h-4 w-4" /> Estado del Servidor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="p-3 rounded-lg bg-background border shadow-sm">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Versión SISGI</p>
                      <p className="text-sm font-mono mt-1">v2.1.0-stable</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background border shadow-sm">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Base de Datos</p>
                      <p className="text-sm mt-1">H2 In-Memory (Dev)</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background border shadow-sm">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">API Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm text-green-500 font-medium">Operacional</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-background border shadow-sm">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Ambiente</p>
                      <p className="text-sm mt-1">Desarrollo / Portafolio</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
