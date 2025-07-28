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
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Truck, Plus, Search, Building, Phone, Mail } from "lucide-react"
import { SupplierFormModal } from "../../components/supplier-form-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge"; 
import { Proveedor } from "@/app/components/types"
import { SupplierDrawer } from "../../components/supplier-drawer" 

export default function ProveedoresPage() {

  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroEstado, setFiltroEstado] = useState<string | null>(null)

  const fetchProveedores = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/proveedores")
      if (!response.ok) throw new Error("Error al obtener los proveedores")
      const data = await response.json()
      setProveedores(data)
    } catch (error) {
      console.error(error)
    }
  }

  const proveedoresFiltrados = proveedores.filter(
    (p) =>
      // --- ACTUALIZADO A CAMELCASE ---
      p.nombreEmpresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.personaContacto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchProveedores()
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
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Gestión de Proveedores</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4">
            {/* Sección de cabecera */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Gestión de Proveedores</h1>
                <p className="text-muted-foreground">Administra proveedores y relaciones comerciales</p>
              </div>
              {/* Usamos el modal para el botón de "Nuevo Proveedor" */}
              <SupplierFormModal onSuccess={fetchProveedores}>
                <Button className="w-fit">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Proveedor
                </Button>
              </SupplierFormModal>
            </div>

            {/* --- SECCIÓN DE ESTADÍSTICAS --- */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Proveedores</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{proveedores.length}</div>
                  <p className="text-xs text-muted-foreground">+2 este mes</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Proveedores Activos</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15</div> {/* Valor estático por ahora */}
                  <p className="text-xs text-muted-foreground">83% del total</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Órdenes Pendientes</CardTitle>
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7</div> {/* Valor estático por ahora */}
                  <p className="text-xs text-muted-foreground">Requieren seguimiento</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Tabla de Proveedores */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Proveedores</CardTitle>
                <CardDescription>
                  {proveedoresFiltrados.length} proveedor(es) encontrado(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nombre de empresa o contacto..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">{filtroEstado || "Estado"}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setFiltroEstado(null)}>Todos</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFiltroEstado("Activo")}>Activo</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFiltroEstado("Inactivo")}>Inactivo</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline">Región</Button> {/* Botón de Región como en tu diseño */}

                </div>

                <div className="space-y-4">
                  {proveedoresFiltrados.map((proveedor) => (
                    <div key={proveedor.id} className="p-4 border rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                            <Building className="h-6 w-6" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium text-lg">{proveedor.nombreEmpresa}</p>
                            <p className="text-sm text-muted-foreground">
                              Contacto: {proveedor.personaContacto}
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Phone className="h-3 w-3" />
                                <span>{proveedor.telefono}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Mail className="h-3 w-3" />
                                <span>{proveedor.email}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                           <div className="text-right">
                                <p className="text-sm font-medium">45 productos</p> {/* Dato estático por ahora */}
                                <Badge variant={proveedor.estado === "Activo" ? "default" : "secondary"}>
                                  {proveedor.estado}
                                </Badge>
                            </div>
                           <SupplierDrawer proveedor={proveedor} onSuccess={fetchProveedores} />
                        </div>
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