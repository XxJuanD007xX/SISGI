"use client"

import { useEffect, useState } from "react";
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
import { BarChart3, Plus, FileText, Download, Calendar, TrendingUp, DollarSign, Truck, Clock } from "lucide-react"

interface ReporteStats {
  totalProductos: number;
  valorInventario: number;
  totalProveedores: number;
  ordenesPendientes: number;
}

export default function ReportesPage() {

  const [stats, setStats] = useState<ReporteStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/reportes/dashboard-stats");
        if (response.ok) {
          const data: ReporteStats = await response.json();
          setStats(data);
        } else {
          console.error("Error al obtener las estadísticas del dashboard");
        }
      } catch (error) {
        console.error("Error de conexión al obtener estadísticas:", error);
      }
    };

    fetchStats();
  }, []);

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
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <CardTitle className="text-sm">Total Productos</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Muestra el dato real o un esqueleto mientras carga */}
                  <div className="text-2xl font-bold">{stats ? stats.totalProductos : "..."}</div>
                  <CardDescription className="text-xs">Unidades registradas</CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <CardTitle className="text-sm">Valor del Inventario</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold">
                    {stats ? `$${stats.valorInventario.toLocaleString()}` : "$..."}
                  </div>
                  <CardDescription className="text-xs">Costo total del stock</CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <CardTitle className="text-sm">Total Proveedores</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold">{stats ? stats.totalProveedores : "..."}</div>
                  <CardDescription className="text-xs">Socios comerciales</CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <CardTitle className="text-sm">Órdenes Pendientes</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold">{stats ? stats.ordenesPendientes : "..."}</div>
                  <CardDescription className="text-xs">Esperando recepción</CardDescription>
                </CardContent>
              </Card>
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
                    <div
                      key={reporte.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
                    >
                      <div className="flex items-center space-x-4 flex-1">
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
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
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
