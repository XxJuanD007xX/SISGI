"use client"

import React, { useState, useEffect } from "react"
import { AppSidebar } from "@/app/components/app-sidebar"
import { DashboardHeader } from "@/app/components/dashboard-header";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Truck, Plus, Search, Building, Phone, Mail, CheckCircle, Clock, FileText } from "lucide-react"
import { SupplierFormModal } from "../../components/supplier-form-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge"; 
import { Proveedor, Product } from "@/app/components/types"
import { SupplierDrawer } from "../../components/supplier-drawer" 

interface ProveedorStats {
  totalProveedores: number;
  proveedoresActivos: number;
  ordenesPendientes: number;
}

export default function ProveedoresPage() {

  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [productos, setProductos] = useState<Product[]>([])
  const [stats, setStats] = useState<ProveedorStats | null>(null);
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

  // --- FUNCIÓN PARA OBTENER PRODUCTOS ---
  const fetchProductos = async () => {
    try {
        const res = await fetch("http://localhost:8080/api/products");
        if(res.ok) setProductos(await res.json());
    } catch (error) {
        console.error("Error fetching productos:", error);
    }
  }

  // --- FUNCIÓN PARA OBTENER ESTADÍSTICAS ---
  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/reportes/proveedores-stats");
      if (response.ok) {
        setStats(await response.json());
      }
    } catch (error) {
      console.error("Error al obtener estadísticas de proveedores:", error);
    }
  };

  const proveedoresFiltrados = proveedores.filter(
    (p) =>
      (p.nombreEmpresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.personaContacto.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filtroEstado ? p.estado === filtroEstado : true)
  );

  useEffect(() => {
    fetchProveedores()
    fetchProductos()
    fetchStats();
  }, [])

  // --- FUNCIÓN PARA CONTAR PRODUCTOS POR PROVEEDOR ---
  const contarProductosPorProveedor = (idProveedor?: number) => {
    if (!idProveedor) return 0;
    return productos.filter(p => p.proveedor?.id === idProveedor).length;
  }

  return (
    <div className="dark">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader pageTitle="Gestión de Proveedores" />

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
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-primary" />
                    <CardTitle className="text-sm">Total Proveedores</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats ? stats.totalProveedores : "..."}</div>
                  <p className="text-xs text-muted-foreground">Proveedores registrados</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <CardTitle className="text-sm">Proveedores Activos</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats ? stats.proveedoresActivos : "..."}</div>
                   <p className="text-xs text-muted-foreground">
                    {stats ? `${Math.round((stats.proveedoresActivos / stats.totalProveedores) * 100) || 0}% del total` : "Calculando..."}
                   </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <CardTitle className="text-sm">Órdenes Pendientes</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats ? stats.ordenesPendientes : "..."}</div>
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
                              {/* --- CONTEO DINÁMICO DE PRODUCTOS --- */}
                              <p className="text-sm font-medium flex items-center justify-end gap-1">
                                  {contarProductosPorProveedor(proveedor.id)} productos
                                  <FileText className="h-3 w-3" />
                              </p>
                              <Badge variant={proveedor.estado === "Activo" ? "default" : "secondary"}>
                                {proveedor.estado}
                              </Badge>
                          </div>
                          <SupplierDrawer proveedor={proveedor} onSuccess={() => { fetchProveedores(); fetchStats(); }} />
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