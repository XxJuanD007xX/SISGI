"use client"

import React, { useState, useEffect } from "react"
import { AppSidebar } from "@/app/components/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DollarSign, Plus, Calendar, User } from "lucide-react"
import { Venta } from "@/app/components/types"
import { VentaFormModal } from "@/app/components/venta-form-modal"
import { VentaDrawer } from "@/app/components/venta-drawer";

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([])

  const fetchVentas = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/ventas")
      if (!response.ok) throw new Error("Error al obtener las ventas")
      const data = await response.json()
      setVentas(data.sort((a, b) => new Date(b.fechaVenta).getTime() - new Date(a.fechaVenta).getTime()));
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchVentas()
  }, [])

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
                <BreadcrumbItem><BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>Ventas</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
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
                <CardDescription>{ventas.length} ventas encontradas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ventas.map((venta) => (
                    <div key={venta.id} className="p-4 border rounded-lg flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <DollarSign className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">Venta #{venta.id}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(venta.fechaVenta).toLocaleDateString('es-ES')}</span>
                            {venta.cliente && (
                              <>
                                <span>•</span>
                                <User className="h-3 w-3" />
                                <span>{venta.cliente}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 sm:ml-auto">
                        <div className="text-right">
                            <p className="font-bold text-lg">{venta.total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
                            <p className="text-sm text-muted-foreground">{venta.detalles.length} producto(s)</p>
                        </div>
                        <VentaDrawer venta={venta} onSuccess={fetchVentas} />
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