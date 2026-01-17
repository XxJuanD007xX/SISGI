"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  Truck,
  AlertTriangle,
  DollarSign,
  Bell,
  ShoppingBag,
  PlusCircle,
  FileBarChart,
  Activity
} from "lucide-react"
import Link from "next/link"

// --- COMPONENTE DE TARJETAS DE ESTADÍSTICAS (STATS CARDS) ---
export function StatsCards() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:8080/api/reportes/dashboard-stats")
      .then(res => res.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    {
      title: "Productos",
      value: stats?.totalProductos || 0,
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      desc: "En catálogo"
    },
    {
      title: "Valor Inventario",
      value: `$${(stats?.valorInventario || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      desc: "Activos totales"
    },
    {
      title: "Proveedores",
      value: stats?.totalProveedores || 0,
      icon: Truck,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      desc: "Socios registrados"
    },
    {
      title: "Pedidos Pendientes",
      value: stats?.ordenesPendientes || 0,
      icon: AlertTriangle,
      color: stats?.ordenesPendientes > 0 ? "text-orange-500" : "text-muted-foreground",
      bg: stats?.ordenesPendientes > 0 ? "bg-orange-500/10" : "bg-muted",
      desc: "Requieren atención"
    },
  ]

  if (loading) {
    return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
    </div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((stat, index) => (
        <Card key={index} className="border-none shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-transparent pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// --- ACCIONES RÁPIDAS ---
export function QuickActions() {
  const actions = [
    { title: "Registrar Venta", icon: ShoppingBag, href: "/dashboard/ventas", gradient: "from-pink-500 to-rose-500" },
    { title: "Nuevo Producto", icon: PlusCircle, href: "/dashboard/productos", gradient: "from-blue-500 to-cyan-500" },
    { title: "Crear Orden", icon: Truck, href: "/dashboard/ordenes", gradient: "from-emerald-500 to-green-500" },
    { title: "Ver Reportes", icon: FileBarChart, href: "/dashboard/reportes", gradient: "from-purple-500 to-indigo-500" },
  ]

  return (
    <Card className="border-none shadow-lg overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-transparent pointer-events-none" />
      <CardHeader>
        <CardTitle>Acceso Rápido</CardTitle>
        <CardDescription>Gestión eficiente en un clic</CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Link href={action.href} key={index} className="block">
              <div className={`group relative overflow-hidden rounded-xl p-4 transition-all hover:scale-[1.02] cursor-pointer border border-border/50 hover:border-transparent`}>
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${action.gradient}`} />
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className={`p-2 rounded-full bg-gradient-to-br ${action.gradient} text-white shadow-sm group-hover:shadow-md transition-all`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {action.title}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// --- ACTIVIDAD RECIENTE DINÁMICA ---
export function RecentActivity() {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:8080/api/reportes/actividad-reciente")
      .then(res => res.ok ? res.json() : [])
      .then(setActivities)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Skeleton className="h-[300px] w-full rounded-xl" />

  return (
    <Card className="h-full border-none shadow-lg overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-transparent pointer-events-none" />
      <CardHeader className="relative z-10">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <CardTitle>Actividad Reciente</CardTitle>
        </div>
        <CardDescription>Movimientos en tiempo real del sistema</CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-6">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No hay actividad reciente.</p>
          ) : (
            activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 group">
                <div className="relative mt-1">
                  <div className={`p-2 rounded-full shadow-sm z-10 relative ${activity.tipo === 'venta'
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                    {activity.tipo === 'venta' ? <DollarSign className="h-3 w-3" /> : <Package className="h-3 w-3" />}
                  </div>
                  {index !== activities.length - 1 && (
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[1px] h-8 bg-border group-hover:bg-primary/30 transition-colors" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{activity.mensaje}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {activity.tipo} • {activity.fecha === 'Reciente' ? 'Hace un momento' : new Date(activity.fecha).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// --- ALERTA DE STOCK CRÍTICO (Reutilizada pero mejorada visualmente) ---
export function AlertsPanel({ lowStockProducts }: { lowStockProducts: any[] }) {
  if (lowStockProducts.length === 0) return null;

  return (
    <Card className="border-l-4 border-l-red-500 shadow-md bg-red-50/50 dark:bg-red-950/10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400 text-base">
          <Bell className="h-5 w-5 animate-pulse" />
          Atención Requerida
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Hay <strong>{lowStockProducts.length} productos</strong> con stock crítico.
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {lowStockProducts.slice(0, 3).map((p: any) => (
              <span key={p.id} className="px-2 py-1 text-xs rounded-md bg-background border text-red-500 font-medium">
                {p.nombre} ({p.stock})
              </span>
            ))}
            {lowStockProducts.length > 3 && (
              <span className="px-2 py-1 text-xs text-muted-foreground">+{lowStockProducts.length - 3} más</span>
            )}
          </div>
          <Button variant="link" size="sm" className="px-0 text-red-500 h-auto mt-2" asChild>
            <Link href="/dashboard/productos">Gestionar Inventario &rarr;</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}