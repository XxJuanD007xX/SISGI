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
import { BarChart3, Plus, FileText, Download, Calendar, TrendingUp } from "lucide-react"

export default function ReportesPage() {
  const reportes = [
    {
      id: 1,
      nombre: "Reporte de Inventario Mensual",
      tipo: "Inventario",
      fechaCreacion: "2024-01-15",
      estado: "Completado",
      tamaño: "2.3 MB",
    },
    {
      id: 2,
      nombre: "Análisis de Ventas Q1",
      tipo: "Ventas",
      fechaCreacion: "2024-01-10",
      estado: "Completado",
      tamaño: "1.8 MB",
    },
    {
      id: 3,
      nombre: "Reporte de Proveedores",
      tipo: "Proveedores",
      fechaCreacion: "2024-01-08",
      estado: "En Proceso",
      tamaño: "0.9 MB",
    },
  ]

  const tiposReporte = [
    { nombre: "Reporte de Inventario", descripcion: "Estado actual del inventario por categorías", icono: BarChart3 },
    { nombre: "Análisis de Ventas", descripcion: "Tendencias y métricas de ventas por filtros", icono: TrendingUp },
    { nombre: "Reporte de Proveedores", descripcion: "Evaluación de rendimiento de proveedores", icono: FileText },
    { nombre: "Reporte Personalizado", descripcion: "Crea un reporte con parámetros específicos", icono: Plus },
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
                  <BreadcrumbPage>Reportes y Análisis</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Reportes y Análisis</h1>
                <p className="text-muted-foreground">Genera informes de ventas, inventario y análisis</p>
              </div>
              <Button className="w-fit">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Reporte
              </Button>
            </div>

            {/* Quick Report Types */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {tiposReporte.map((tipo, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <tipo.icono className="h-5 w-5 text-primary" />
                      <CardTitle className="text-sm">{tipo.nombre}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-xs">{tipo.descripcion}</CardDescription>
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      Generar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Reportes Recientes</CardTitle>
                <CardDescription>Historial de reportes generados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportes.map((reporte) => (
                    <div key={reporte.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{reporte.nombre}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{reporte.fechaCreacion}</span>
                            <span>•</span>
                            <span>{reporte.tamaño}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge
                          variant={
                            reporte.tipo === "Inventario"
                              ? "default"
                              : reporte.tipo === "Ventas"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {reporte.tipo}
                        </Badge>
                        <Badge variant={reporte.estado === "Completado" ? "default" : "secondary"}>
                          {reporte.estado}
                        </Badge>
                        <Button variant="outline" size="sm" disabled={reporte.estado !== "Completado"}>
                          <Download className="h-4 w-4 mr-2" />
                          Descargar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Analytics Preview */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Resumen de Inventario</CardTitle>
                  <CardDescription>Vista rápida del estado actual</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Gráfico de inventario</p>
                      <p className="text-xs text-muted-foreground">(Datos en tiempo real)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tendencias de Ventas</CardTitle>
                  <CardDescription>Análisis de los últimos 30 días</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Gráfico de tendencias</p>
                      <p className="text-xs text-muted-foreground">(Próximamente)</p>
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
