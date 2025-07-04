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
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Truck, Plus, Search, Building, Phone, Mail } from "lucide-react"
import { SupplierFormModal } from "../../components/supplier-form-modal"

export default function ProveedoresPage() {
  const proveedores = [
    {
      id: 1,
      nombre: "Distribuidora Tech",
      contacto: "Carlos Mendez",
      telefono: "+57 300 123 4567",
      email: "carlos@distribuidoratech.com",
      estado: "Activo",
      productos: 45,
    },
    {
      id: 2,
      nombre: "Textiles del Norte",
      contacto: "Ana Rodríguez",
      telefono: "+57 301 987 6543",
      email: "ana@textilesnorte.com",
      estado: "Activo",
      productos: 78,
    },
    {
      id: 3,
      nombre: "Hogar y Decoración",
      contacto: "Luis García",
      telefono: "+57 302 456 7890",
      email: "luis@hogardeco.com",
      estado: "Inactivo",
      productos: 23,
    },
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
                  <BreadcrumbPage>Gestión de Proveedores</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Gestión de Proveedores</h1>
                <p className="text-muted-foreground">Administra proveedores y relaciones comerciales</p>
              </div>
              <SupplierFormModal />
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Proveedores</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18</div>
                  <p className="text-xs text-muted-foreground">+2 este mes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Proveedores Activos</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15</div>
                  <p className="text-xs text-muted-foreground">83% del total</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Órdenes Pendientes</CardTitle>
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7</div>
                  <p className="text-xs text-muted-foreground">Requieren seguimiento</p>
                </CardContent>
              </Card>
            </div>

            {/* Suppliers Table */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Proveedores</CardTitle>
                <CardDescription>Gestiona todos los proveedores del sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar proveedores..." className="pl-8" />
                  </div>
                  <Button variant="outline">Estado</Button>
                  <Button variant="outline">Región</Button>
                </div>

                <div className="space-y-4">
                  {proveedores.map((proveedor) => (
                    <div key={proveedor.id} className="p-4 border rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                            <Building className="h-6 w-6" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium text-lg">{proveedor.nombre}</p>
                            <p className="text-sm text-muted-foreground">Contacto: {proveedor.contacto}</p>
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
                            <p className="text-sm font-medium">{proveedor.productos} productos</p>
                            <Badge variant={proveedor.estado === "Activo" ? "default" : "secondary"}>
                              {proveedor.estado}
                            </Badge>
                          </div>
                          <Button variant="outline" size="sm">
                            Ver Detalles
                          </Button>
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
