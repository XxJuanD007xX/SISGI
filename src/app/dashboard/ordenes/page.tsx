"use client"

import React, { useState, useEffect } from "react"
import { AppSidebar } from "@/app/components/app-sidebar"
import { DashboardHeader } from "@/app/components/dashboard-header";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ShoppingCart, Plus, Calendar, DollarSign, Search, Filter } from "lucide-react"
import { OrdenCompra } from "@/app/components/types"
import { OrdenCompraFormModal } from "@/app/components/orden-compra-form-modal"
import { OrdenCompraDrawer } from "@/app/components/orden-compra-drawer" 
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function OrdenesPage() {
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroEstado, setFiltroEstado] = useState<string | null>(null)
  
  const fetchOrdenes = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/ordenes")
      if (!response.ok) throw new Error("Error al obtener las órdenes de compra")
      const data = await response.json()
      setOrdenes(data.sort((a: any, b: any) => b.id - a.id))
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchOrdenes()
  }, [])

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "pendiente": return "secondary"
      case "recibido": return "default"
      case "cancelado": return "destructive"
      default: return "outline"
    }
  }

  const ordenesFiltradas = ordenes.filter(o => {
    const coincideBusqueda =
      o.proveedor?.nombreEmpresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id?.toString().includes(searchTerm);
    const coincideEstado = filtroEstado ? o.estado === filtroEstado : true;
    return coincideBusqueda && coincideEstado;
  })

  return (
    <div className="dark">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader pageTitle="Órdenes de Compra" />

          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Órdenes de Compra</h1>
                <p className="text-muted-foreground">Gestiona los pedidos a proveedores y reabastecimiento</p>
              </div>
              <OrdenCompraFormModal onSuccess={fetchOrdenes}>
                  <Button className="w-fit">
                    <Plus className="h-4 w-4 mr-2" /> Nueva Orden
                  </Button>
              </OrdenCompraFormModal>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Historial de Órdenes</CardTitle>
                <CardDescription>{ordenesFiltradas.length} órdenes encontradas</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filtros */}
                <div className="flex items-center space-x-2 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por proveedor o ID de orden..."
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
                      <DropdownMenuItem onClick={() => setFiltroEstado("Pendiente")}>Pendientes</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFiltroEstado("Recibido")}>Recibidas</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFiltroEstado("Cancelado")}>Canceladas</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-4">
                  {ordenesFiltradas.length > 0 ? (
                    ordenesFiltradas.map((orden) => (
                      <div key={orden.id} className="p-4 border rounded-xl flex justify-between items-center hover:bg-muted/30 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                            <ShoppingCart className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold">Orden #{orden.id} - <span className="text-primary">{orden.proveedor?.nombreEmpresa || "N/A"}</span></p>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-0.5">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(orden.fechaOrden).toLocaleDateString('es-ES')}</span>
                              <span className="text-muted-foreground/30">•</span>
                              <DollarSign className="h-3 w-3" />
                              <span className="font-medium">{orden.total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <Badge variant={getEstadoBadgeVariant(orden.estado)} className="uppercase text-[10px] font-bold tracking-wider px-2 py-0.5">
                            {orden.estado}
                          </Badge>
                          <OrdenCompraDrawer orden={orden} onSuccess={fetchOrdenes} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl">
                      <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-20" />
                      <p className="text-muted-foreground font-medium">No se encontraron órdenes con esos criterios.</p>
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
