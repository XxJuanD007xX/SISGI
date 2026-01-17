"use client"

import React, { useState, useEffect } from "react"
import { AppSidebar } from "@/app/components/app-sidebar"
import { DashboardHeader } from "@/app/components/dashboard-header";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DollarSign, Plus, Calendar, User, Search, Filter } from "lucide-react"
import { Venta } from "@/app/components/types"
import { VentaFormModal } from "@/app/components/venta-form-modal"
import { VentaDrawer } from "@/app/components/venta-drawer"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroEstado, setFiltroEstado] = useState<string | null>(null)

  const fetchVentas = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/ventas")
      if (!response.ok) throw new Error("Error al obtener las ventas")
      const data = await response.json()
      setVentas(data.sort((a: Venta, b: Venta) => new Date(b.fechaVenta).getTime() - new Date(a.fechaVenta).getTime()));
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchVentas()
  }, [])

  const ventasFiltradas = ventas.filter(v => {
    const coincideBusqueda =
      v.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.id?.toString().includes(searchTerm);
    const coincideEstado = filtroEstado ? v.estado === filtroEstado : true;
    return coincideBusqueda && coincideEstado;
  })

  return (
    <div className="dark">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader pageTitle="Registro de Ventas" />

          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Registro de Ventas</h1>
                <p className="text-muted-foreground">Consulta el historial de ventas y registra nuevas salidas.</p>
              </div>
              <VentaFormModal onSuccess={fetchVentas}>
                  <Button><Plus className="h-4 w-4 mr-2" />Nueva Venta</Button>
              </VentaFormModal>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Historial de Ventas</CardTitle>
                <CardDescription>{ventasFiltradas.length} ventas encontradas</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filtros */}
                <div className="flex items-center space-x-2 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por cliente o ID de venta..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        {filtroEstado || "Todos los Estados"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setFiltroEstado(null)}>Todos los Estados</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFiltroEstado("COMPLETADA")}>Completadas</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFiltroEstado("ANULADA")}>Anuladas</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-4">
                  {ventasFiltradas.length > 0 ? (
                    ventasFiltradas.map((venta) => (
                      <div key={venta.id} className="p-4 border rounded-xl flex justify-between items-center hover:bg-muted/30 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className={`h-10 w-10 rounded-lg ${venta.estado === "ANULADA" ? "bg-destructive/10" : "bg-primary/10"} flex items-center justify-center`}>
                            <DollarSign className={`h-5 w-5 ${venta.estado === "ANULADA" ? "text-destructive" : "text-primary"}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold">Venta #{venta.id}</p>
                              {venta.estado === "ANULADA" && (
                                <Badge variant="destructive" className="h-5 text-[10px] px-1.5 uppercase font-bold tracking-wider">ANULADA</Badge>
                              )}
                              {venta.estado === "COMPLETADA" && (
                                <Badge variant="secondary" className="h-5 text-[10px] px-1.5 uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-500 border-emerald-500/20">COMPLETADA</Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-0.5">
                              <Calendar className="h-3 w-3" />
                              <span className="capitalize">{new Date(venta.fechaVenta).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              {venta.cliente && (
                                <>
                                  <span className="text-muted-foreground/30">•</span>
                                  <User className="h-3 w-3" />
                                  <span>{venta.cliente}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 sm:ml-auto">
                          <div className="text-right hidden sm:block">
                              <p className={`font-bold text-lg ${venta.estado === "ANULADA" ? "line-through text-muted-foreground" : ""}`}>
                                {venta.total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                              </p>
                              <p className="text-xs text-muted-foreground">{venta.detalles.length} producto(s)</p>
                          </div>
                          <VentaDrawer venta={venta} onSuccess={fetchVentas} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl">
                      <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-20" />
                      <p className="text-muted-foreground font-medium">No se encontraron ventas con esos criterios.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
