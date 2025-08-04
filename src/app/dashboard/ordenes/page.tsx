"use client"

import React, { useState, useEffect } from "react"
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
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ShoppingCart, Plus, Calendar, DollarSign } from "lucide-react"
import { OrdenCompra } from "@/app/components/types"
import { OrdenCompraFormModal } from "@/app/components/orden-compra-form-modal"
import { OrdenCompraDrawer } from "@/app/components/orden-compra-drawer" 

export default function OrdenesPage() {
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([])
  
  // Función para obtener las órdenes desde la API
  const fetchOrdenes = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/ordenes")
      if (!response.ok) {
        throw new Error("Error al obtener las órdenes de compra")
      }
      const data = await response.json()
      setOrdenes(data)
    } catch (error) {
      console.error(error)
    }
  }

  // Cargar las órdenes cuando el componente se monta
  useEffect(() => {
    fetchOrdenes()
  }, [])

  // Función para dar color al estado de la orden
  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "pendiente":
        return "secondary"
      case "recibido":
        return "default"
      case "cancelado":
        return "destructive"
      default:
        return "outline"
    }
  }

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
                  <BreadcrumbPage>Órdenes de Compra</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Órdenes de Compra</h1>
                <p className="text-muted-foreground">Gestiona los pedidos a proveedores</p>
              </div>
              <OrdenCompraFormModal onSuccess={fetchOrdenes}>
                  <Button className="w-fit">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Orden
                  </Button>
              </OrdenCompraFormModal>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Historial de Órdenes</CardTitle>
                <CardDescription>{ordenes.length} órdenes encontradas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ordenes.map((orden) => (
                    <div key={orden.id} className="p-4 border rounded-lg flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <ShoppingCart className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">Orden #{orden.id} - {orden.proveedor.nombreEmpresa}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{orden.fechaOrden}</span>
                            <span>•</span>
                            <DollarSign className="h-3 w-3" />
                            <span>{orden.total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={getEstadoBadgeVariant(orden.estado)}>
                          {orden.estado}
                        </Badge>
                        
                        {/* --- 4. REEMPLAZAR BOTÓN ESTÁTICO POR EL DRAWER --- */}
                        <OrdenCompraDrawer orden={orden} onSuccess={fetchOrdenes} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}