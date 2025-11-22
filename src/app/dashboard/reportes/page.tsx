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
import { BarChart3, Plus, FileText, Download, Calendar, TrendingUp, DollarSign, Truck, Clock, Filter, FileSpreadsheet } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface ReporteStats {
  totalProductos: number;
  valorInventario: number;
  totalProveedores: number;
  ordenesPendientes: number;
}

// Datos simulados para el reporte de ventas (esto vendría de tu API)
const datosVentas = [
  { id: 1, fecha: "2024-01-15", producto: "Smartwatch Pro", cantidad: 5, total: 2750000, cliente: "Juan Pérez" },
  { id: 2, fecha: "2024-01-16", producto: "Camiseta DryFit", cantidad: 10, total: 450000, cliente: "Ana Gómez" },
  { id: 3, fecha: "2024-01-17", producto: "Audífonos BT", cantidad: 3, total: 360000, cliente: "Carlos Ruiz" },
  { id: 4, fecha: "2024-01-18", producto: "Zapatillas Running", cantidad: 2, total: 600000, cliente: "Maria Lopez" },
];

export default function ReportesPage() {

  const [stats, setStats] = useState<ReporteStats | null>(null);
  const [tipoReporte, setTipoReporte] = useState("ventas");

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

  // --- FUNCIÓN DE EXPORTACIÓN A CSV (Excel Compatible) ---
  const exportarAExcel = () => {
    // 1. Definir los encabezados
    const headers = ["ID", "Fecha", "Producto", "Cantidad", "Total", "Cliente"];

    // 2. Convertir los datos a formato CSV
    const csvContent = [
      headers.join(","), // Fila de encabezados
      ...datosVentas.map(row =>
        `${row.id},"${row.fecha}","${row.producto}",${row.cantidad},${row.total},"${row.cliente}"`
      )
    ].join("\n");

    // 3. Crear el Blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `reporte_${tipoReporte}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Reporte descargado exitosamente");
  };

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
                <p className="text-muted-foreground">Visualiza métricas clave y exporta datos para tu gestión</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => toast.info("Generando PDF...")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
                <Button onClick={exportarAExcel}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Exportar Excel
                </Button>
              </div>
            </div>

            {/* Quick Report Types */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Ventas Totales (Mes)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$4,160,000</div>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" /> +12.5% vs mes anterior
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Valor Inventario</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats ? `$${stats.valorInventario.toLocaleString()}` : "$..."}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Proveedores Activos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats ? stats.totalProveedores : "..."}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pedidos Pendientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats ? stats.ordenesPendientes : "..."}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-3">

              {/* Panel Lateral de Filtros */}
              <Card className="md:col-span-1 h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" /> Filtros de Reporte
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo de Datos</label>
                    <Select value={tipoReporte} onValueChange={setTipoReporte}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ventas">Ventas</SelectItem>
                        <SelectItem value="inventario">Inventario</SelectItem>
                        <SelectItem value="proveedores">Proveedores</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rango de Fecha</label>
                    <Select defaultValue="mes">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hoy">Hoy</SelectItem>
                        <SelectItem value="semana">Esta Semana</SelectItem>
                        <SelectItem value="mes">Este Mes</SelectItem>
                        <SelectItem value="anio">Este Año</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full mt-4" onClick={() => toast.success("Filtros aplicados")}>
                    Aplicar Filtros
                  </Button>
                </CardContent>
              </Card>

              {/* Tabla de Datos (Vista Previa) */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Vista Previa del Reporte</CardTitle>
                  <CardDescription>Mostrando datos de {tipoReporte} para el periodo seleccionado.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted/50 text-muted-foreground">
                        <tr>
                          <th className="p-3 font-medium">Fecha</th>
                          <th className="p-3 font-medium">Producto</th>
                          <th className="p-3 font-medium text-right">Cant.</th>
                          <th className="p-3 font-medium text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {datosVentas.map((venta) => (
                          <tr key={venta.id} className="border-t hover:bg-muted/50 transition-colors">
                            <td className="p-3">{venta.fecha}</td>
                            <td className="p-3 font-medium">{venta.producto}</td>
                            <td className="p-3 text-right">{venta.cantidad}</td>
                            <td className="p-3 text-right">${venta.total.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground text-center">
                    Mostrando 4 de 150 registros. Exporta para ver todo.
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
