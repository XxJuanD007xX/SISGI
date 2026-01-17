"use client"

import { useEffect, useState } from "react";
import { AppSidebar } from "@/app/components/app-sidebar"
import { StatsCards, QuickActions, RecentActivity, AlertsPanel } from "@/app/components/dashboard-widgets"
import { SalesChart } from "@/app/components/charts/sales-chart"
import { CategoryChart } from "@/app/components/charts/category-chart"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Zap, AlertTriangle } from "lucide-react"
import { Product } from "@/app/components/types";
import { DashboardHeader } from "@/app/components/dashboard-header";

export default function Dashboard() {

  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

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
  }, []);

  return (
    <div className="dark bg-background min-h-screen">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader pageTitle="Resumen General" />

          {/* Main Content */}
          <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6 max-w-[1600px] mx-auto w-full animate-in fade-in-50 duration-500">

            {/* Welcome Banner Dinámico */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/90 to-purple-600 p-8 text-white shadow-xl">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-40 w-40 rounded-full bg-black/10 blur-2xl"></div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    ¡Hola, Equipo Dipal! <span className="text-2xl">👋</span>
                  </h1>
                  <p className="text-white/80 mt-2 max-w-xl">
                    Aquí tienes el resumen de operaciones de hoy. El inventario se está moviendo y hay algunas tareas pendientes.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                    <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-sm font-medium">Sistema en línea</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards (Dinámicas) */}
            <StatsCards />

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">

              {/* Columna Principal (Izquierda) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Gráfico de Ventas */}
                <SalesChart />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Alertas de Stock */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" /> Prioridad Alta
                    </h3>
                    {lowStockProducts.length > 0 ? (
                      <AlertsPanel lowStockProducts={lowStockProducts} />
                    ) : (
                      <div className="p-6 border border-dashed rounded-xl flex flex-col items-center justify-center text-center bg-muted/20">
                        <Zap className="h-8 w-8 text-green-500 mb-2" />
                        <p className="text-sm font-medium">Todo bajo control</p>
                        <p className="text-xs text-muted-foreground">No hay alertas de stock crítico.</p>
                      </div>
                    )}
                  </div>

                  {/* Gráfico de Categorías */}
                  <div className="h-full">
                    <CategoryChart />
                  </div>
                </div>
              </div>

              {/* Columna Lateral (Derecha) */}
              <div className="lg:col-span-2 space-y-6">

                {/* Acciones Rápidas */}
                <QuickActions />

                {/* Actividad Reciente */}
                <RecentActivity />

              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}