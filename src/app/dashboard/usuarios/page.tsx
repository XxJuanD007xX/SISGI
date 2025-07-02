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
import { Users, Plus, Search, UserCheck, Shield } from "lucide-react"

export default function UsuariosPage() {
  const usuarios = [
    {
      id: 1,
      nombre: "Juan Pérez",
      email: "juan@variedadesdipal.com",
      rol: "Administrador",
      estado: "Activo",
      ultimoAcceso: "Hace 2 horas",
    },
    {
      id: 2,
      nombre: "María González",
      email: "maria@variedadesdipal.com",
      rol: "Agente",
      estado: "Activo",
      ultimoAcceso: "Hace 1 día",
    },
    {
      id: 3,
      nombre: "Carlos Rodríguez",
      email: "carlos@variedadesdipal.com",
      rol: "Agente",
      estado: "Inactivo",
      ultimoAcceso: "Hace 1 semana",
    },
    {
      id: 4,
      nombre: "Ana López",
      email: "ana@variedadesdipal.com",
      rol: "Agente",
      estado: "Activo",
      ultimoAcceso: "Hace 3 horas",
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
                  <BreadcrumbPage>Gestión de Usuarios</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
                <p className="text-muted-foreground">Administra usuarios, roles y permisos del sistema</p>
              </div>
              <Button className="w-fit">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Usuario
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 este mes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">10</div>
                  <p className="text-xs text-muted-foreground">83% del total</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Administradores</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">25% del total</p>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Usuarios</CardTitle>
                <CardDescription>Gestiona todos los usuarios del sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar usuarios..." className="pl-8" />
                  </div>
                  <Button variant="outline">Filtros</Button>
                </div>

                {/* Users Table */}
                <div className="space-y-4">
                  {usuarios.map((usuario) => (
                    <div
                      key={usuario.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{usuario.nombre}</p>
                          <p className="text-sm text-muted-foreground">{usuario.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <Badge variant={usuario.rol === "Administrador" ? "default" : "secondary"}>{usuario.rol}</Badge>
                        <Badge variant={usuario.estado === "Activo" ? "default" : "secondary"}>{usuario.estado}</Badge>
                        <div className="text-sm text-muted-foreground">{usuario.ultimoAcceso}</div>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
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
