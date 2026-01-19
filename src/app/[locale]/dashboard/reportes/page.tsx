"use client"

import { useState, useEffect } from "react";
import { AppSidebar } from "@/app/components/app-sidebar"
import { DashboardHeader } from "@/app/components/dashboard-header";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  FileText,
  Download,
  Filter,
  Printer,
  Calendar as CalendarIcon
} from "lucide-react"
import { toast } from "sonner"
import { format, subDays, isValid, parseISO } from "date-fns" // Importamos isValid y parseISO
import { es } from "date-fns/locale"

export default function ReportesPage() {
  const [fechaInicio, setFechaInicio] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'))
  const [fechaFin, setFechaFin] = useState(format(new Date(), 'yyyy-MM-dd'))

  const [ventasData, setVentasData] = useState<any[]>([])
  const [inventarioData, setInventarioData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchDataVentas = async () => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:8080/api/reportes/ventas?inicio=${fechaInicio}&fin=${fechaFin}`)
      if (res.ok) setVentasData(await res.json())
    } catch (e) {
      toast.error("Error cargando datos de ventas")
    } finally {
      setLoading(false)
    }
  }

  const fetchDataInventario = async () => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:8080/api/reportes/inventario`)
      if (res.ok) setInventarioData(await res.json())
    } catch (e) {
      toast.error("Error cargando inventario")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDataVentas()
    fetchDataInventario()
  }, [])

  const handleDownloadPdf = (tipo: 'ventas' | 'inventario') => {
    let url = ""
    if (tipo === 'ventas') {
      url = `http://localhost:8080/api/reportes/ventas/pdf?inicio=${fechaInicio}&fin=${fechaFin}`
    } else {
      url = `http://localhost:8080/api/reportes/inventario/pdf`
    }
    window.open(url, '_blank')
    toast.success("Generando reporte PDF...")
  }

  // --- FUNCIÓN AUXILIAR SEGURA PARA FORMATEAR FECHAS ---
  const safeFormatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "d MMM", { locale: es }) : "--";
  }

  return (
    <div className="dark bg-background min-h-screen">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader pageTitle="Centro de Reportes" />

          <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                  <FileText className="h-8 w-8 text-primary" /> Reportes y Análisis
                </h1>
                <p className="text-muted-foreground">Genera documentación oficial y analiza el rendimiento.</p>
              </div>
            </div>

            <Tabs defaultValue="ventas" className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <TabsList className="grid w-full sm:w-auto grid-cols-2">
                  <TabsTrigger value="ventas">Reporte de Ventas</TabsTrigger>
                  <TabsTrigger value="inventario">Valoración de Inventario</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2 w-full sm:w-auto bg-muted/50 p-1 rounded-lg border">
                  <div className="flex items-center gap-2 px-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">Periodo:</span>
                  </div>
                  <Input
                    type="date"
                    className="h-8 w-32 text-xs bg-background border-none shadow-none focus-visible:ring-0"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="date"
                    className="h-8 w-32 text-xs bg-background border-none shadow-none focus-visible:ring-0"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                  />
                  <Button size="sm" variant="secondary" className="h-8 px-3" onClick={fetchDataVentas}>
                    <Filter className="h-3 w-3 mr-1" /> Filtrar
                  </Button>
                </div>
              </div>

              {/* --- TAB: VENTAS --- */}
              <TabsContent value="ventas" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Histórico de Ventas</CardTitle>
                      {/* USAMOS LA FUNCIÓN SEGURA AQUÍ PARA EVITAR EL ERROR */}
                      <CardDescription>
                        Mostrando {ventasData.length} registros del {safeFormatDate(fechaInicio)} al {safeFormatDate(fechaFin)}.
                      </CardDescription>
                    </div>
                    <Button onClick={() => handleDownloadPdf('ventas')}>
                      <Printer className="h-4 w-4 mr-2" /> Imprimir / PDF Oficial
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                          <tr className="border-b">
                            <th className="h-10 px-4 text-left font-medium">ID</th>
                            <th className="h-10 px-4 text-left font-medium">Fecha</th>
                            <th className="h-10 px-4 text-left font-medium">Cliente</th>
                            <th className="h-10 px-4 text-right font-medium">Items</th>
                            <th className="h-10 px-4 text-right font-medium">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <tr><td colSpan={5} className="p-4 text-center">Cargando datos...</td></tr>
                          ) : ventasData.length === 0 ? (
                            <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">No hay ventas en este rango.</td></tr>
                          ) : (
                            ventasData.map((venta) => (
                              <tr key={venta.id} className="border-b hover:bg-muted/30 transition-colors">
                                <td className="p-4 font-medium">#{venta.id}</td>
                                <td className="p-4">{venta.fechaVenta}</td>
                                <td className="p-4">{venta.cliente || "Consumidor Final"}</td>
                                <td className="p-4 text-right">{venta.detalles?.length || 0}</td>
                                <td className="p-4 text-right font-bold text-emerald-500">
                                  ${venta.total.toLocaleString()}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* --- TAB: INVENTARIO --- */}
              <TabsContent value="inventario" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Valoración de Inventario Actual</CardTitle>
                      <CardDescription>
                        Snapshot de todos los productos y su valor monetario.
                      </CardDescription>
                    </div>
                    <Button onClick={() => handleDownloadPdf('inventario')} variant="outline" className="border-primary text-primary hover:bg-primary/10">
                      <Download className="h-4 w-4 mr-2" /> Descargar Reporte PDF
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border overflow-hidden max-h-[600px] overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground sticky top-0">
                          <tr className="border-b">
                            <th className="h-10 px-4 text-left font-medium">Producto</th>
                            <th className="h-10 px-4 text-left font-medium">Categoría</th>
                            <th className="h-10 px-4 text-right font-medium">Stock</th>
                            <th className="h-10 px-4 text-right font-medium">Precio Unit.</th>
                            <th className="h-10 px-4 text-right font-medium">Valor Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inventarioData.map((prod) => (
                            <tr key={prod.id} className="border-b hover:bg-muted/30 transition-colors">
                              <td className="p-4 font-medium">{prod.nombre}</td>
                              <td className="p-4"><span className="px-2 py-1 rounded-full bg-muted text-xs">{prod.categoria}</span></td>
                              <td className={`p-4 text-right ${prod.stock <= (prod.stockMinimo || 5) ? "text-red-500 font-bold" : ""}`}>
                                {prod.stock}
                              </td>
                              <td className="p-4 text-right">${prod.precio.toLocaleString()}</td>
                              <td className="p-4 text-right font-mono text-muted-foreground">
                                ${(prod.stock * prod.precio).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <div className="bg-card border p-4 rounded-lg shadow-sm min-w-[250px]">
                        <p className="text-sm text-muted-foreground mb-1">Valor Total del Inventario</p>
                        <p className="text-2xl font-bold">
                          ${inventarioData.reduce((acc, curr) => acc + (curr.stock * curr.precio), 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}