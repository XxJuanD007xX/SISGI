"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
import { Package, Plus, Search, AlertTriangle, TrendingUp, DollarSign } from "lucide-react"
import { ProductFormModal } from "../../components/product-form-modal";
import { ProductDrawer } from "../../components/product-drawer"
import { Product } from "@/app/components/types"

import { useEffect, useState } from "react"

interface Producto {
  id: number
  nombre: string
  categoria: string
  stock: number
  precio: number
  stockMinimo?: number
  descripcion?: string
}
 
export default function ProductosPage() {

  const [productos, setProductos] = useState<Product[]>([])
  const [busqueda, setBusqueda] = useState("");
  const categoriasUnicas = Array.from(new Set(productos.map(p => p.categoria)));
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string | null>(null);
  
  const productosConBajoStock = productos.filter(
    (p) => p.stock > 0 && p.stock <= (p.stockMinimo ?? 5)
  );
  
  const productosFiltrados = productos.filter(producto => {
    // Filtro búsqueda
    const coincideBusqueda =
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.categoria.toLowerCase().includes(busqueda.toLowerCase());

    // Filtro categoría
    const coincideCategoria = categoriaSeleccionada
      ? producto.categoria === categoriaSeleccionada
      : true;

    // Filtro estado
    let estado = "En Stock";
    if (producto.stock === 0) estado = "Agotado";
    else if (producto.stock <= (producto.stockMinimo ?? 5)) estado = "Stock Bajo";
    const coincideEstado = estadoSeleccionado
      ? estado === estadoSeleccionado
      : true;

    return coincideBusqueda && coincideCategoria && coincideEstado;
  });

  const fetchProductos = () => {
    fetch("http://localhost:8080/api/products")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error al obtener productos:", err))
  }

  useEffect(() => {
    fetchProductos()
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
                  <BreadcrumbPage>Gestión de Productos</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Gestión de Productos</h1>
                <p className="text-muted-foreground">Control de inventario, categorías y stock de productos</p>
              </div>
              {/* Botón para registrar nuevo producto */}
              <ProductFormModal onSuccess={fetchProductos}>
                <Button className="w-fit">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Producto
                </Button>
              </ProductFormModal>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              {/* Total Productos */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{productos.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {productos.length > 0 ? `+${productos.length} en total` : "Sin productos"}
                  </p>
                </CardContent>
              </Card>

              {/* Stock Bajo */}
              <Card className="flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                        {productosConBajoStock.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Productos requieren atención
                    </p>
                </CardContent>
                <div className="mt-auto p-6 pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setEstadoSeleccionado("Stock Bajo")}
                    >
                        Revisar Productos
                    </Button>
                </div>
              </Card>

              {/* Valor Inventario */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Valor Inventario</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    $
                    {productos
                      .reduce((acc, p) => acc + (p.precio * p.stock), 0)
                      .toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">Inventario total</p>
                </CardContent>
              </Card>

              {/* Categorías */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categorías</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {
                      Array.from(new Set(productos.map((p) => p.categoria))).length
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">Activas</p>
                </CardContent>
              </Card>
            </div>

            {/* Products Table */}
            <Card>
              <CardHeader>
                <CardTitle>Inventario de Productos</CardTitle>
                <CardDescription>Lista completa de productos en el sistema</CardDescription>
              </CardHeader>
              <CardContent>

                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar productos..."
                      className="pl-8"
                      value={busqueda}
                      onChange={e => setBusqueda(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        {categoriaSeleccionada || "Categorías"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setCategoriaSeleccionada(null)}>
                        Todas
                      </DropdownMenuItem>
                      {categoriasUnicas.map(cat => (
                        <DropdownMenuItem key={cat} onClick={() => setCategoriaSeleccionada(cat)}>
                          {cat}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        {estadoSeleccionado || "Estado"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setEstadoSeleccionado(null)}>
                        Todos
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEstadoSeleccionado("En Stock")}>
                        En Stock
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEstadoSeleccionado("Stock Bajo")}>
                        Stock Bajo
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEstadoSeleccionado("Agotado")}>
                        Agotado
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-4">
                  {productosFiltrados.map((producto) => (
                    <div
                      key={producto.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{producto.nombre}</p>
                          <p className="text-sm text-muted-foreground">{producto.categoria}</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="text-right">

                          <p className="font-medium">${producto.precio.toLocaleString()}</p>

                          <p className="text-sm text-muted-foreground">Stock: {producto.stock}</p>
                        </div>
                        <Badge
                          variant={
                            producto.stock === 0
                              ? "destructive"
                              : producto.stock <= (producto.stockMinimo ?? 5)
                              ? "secondary"
                              : "default"
                          }
                        >
                          {producto.stock === 0 ? "Agotado" : producto.stock <= (producto.stockMinimo ?? 5) ? "Stock Bajo" : "En Stock"}
                        </Badge>
                        
                        <ProductDrawer producto={producto} onSuccess={fetchProductos} />

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
