"use client"

import { useEffect, useState } from "react"; 
import { AppSidebar } from "@/app/components/app-sidebar"
import { StatsCards, QuickActions, InventoryStatus, RecentActivity, AlertsPanel } from "@/app/components/dashboard-widgets"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import { ThemeSwitcher } from "@/app/components/theme-switcher"
import { Product } from "@/app/components/types";

export default function Dashboard() {
  const currentDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Estado para guardar los productos con bajo stock
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  //useEffect para llamar a la API cuando el componente se cargue
  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/products/stock-bajo");
        if (response.ok) {
          const data = await response.json();
          setLowStockProducts(data);
        }
      } catch (error) {
        console.error("Error al obtener productos con bajo stock:", error);
      }
    };

    fetchLowStockProducts();
  }, []); // El array vacío asegura que se ejecute solo una vez

  return (
    <div className="dark">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">SISGI Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Panel Principal</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-4">
              <ThemeSwitcher />
              <Badge variant="outline" className="hidden md:flex">
                <Calendar className="w-4 h-4 mr-2" />
                {currentDate}
              </Badge>
              <Badge variant="secondary">
                <Clock className="w-4 h-4 mr-2" />
                Sistema Activo
              </Badge>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex flex-1 flex-col gap-4 p-4">
            {/* Welcome Section */}
            <div className="rounded-xl bg-muted/50 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">¡Bienvenido al Dashboard SISGI!</h1>
                  <p className="text-muted-foreground mt-2">Sistema de Gestión de Inventarios - Variedades Dipal</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>Todos los sistemas operativos</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <StatsCards lowStockCount={lowStockProducts.length} />

            {/* Main Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

              {/* Alerts Panel */}
              <AlertsPanel lowStockProducts={lowStockProducts} />

              {/* Quick Actions */}
              <QuickActions />

              {/* Inventory Status */}
              <InventoryStatus />

            </div>

            {/* Bottom Section */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Recent Activity */}
              <RecentActivity />

              {/* Performance Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Rendimiento del Sistema</CardTitle>
                  <CardDescription>Métricas de los últimos 7 días</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-muted-foreground">📊</div>
                      <p className="text-sm text-muted-foreground mt-2">Gráfico de rendimiento</p>
                      <p className="text-xs text-muted-foreground">(Próximamente con datos reales)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
