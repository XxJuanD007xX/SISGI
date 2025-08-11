"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Product } from "./types";
import {
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  Truck,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Bell,
} from "lucide-react"

export function StatsCards({ lowStockCount }: { lowStockCount: number }) {
  const stats = [
    {
      title: "Productos Totales",
      value: "245",
      change: "+12%",
      trend: "up",
      icon: Package,
      description: "vs mes anterior",
    },
    {
      title: "Valor del Inventario",
      value: "$125,430",
      change: "+8.2%",
      trend: "up",
      icon: DollarSign,
      description: "valor total actual",
    },
    {
      title: "Productos con Stock Bajo",
      value: lowStockCount.toString(),
      change: `-${lowStockCount}`,
      trend: "down",
      icon: AlertTriangle,
      description: "requieren reabastecimiento",
    },
    {
      title: "Proveedores Activos",
      value: "15",
      change: "+2",
      trend: "up",
      icon: Truck,
      description: "de 18 totales",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className={`flex items-center ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {stat.change}
              </span>
              <span>{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function QuickActions() {
  const actions = [
    { title: "Nuevo Producto", icon: Package, href: "/dashboard/productos/nuevo", color: "bg-blue-500" },
    { title: "Nuevo Proveedor", icon: Truck, href: "/dashboard/proveedores/nuevo", color: "bg-green-500" },
    { title: "Generar Reporte", icon: TrendingUp, href: "/dashboard/reportes/nuevo", color: "bg-purple-500" },
    { title: "Nuevo Usuario", icon: Users, href: "/dashboard/usuarios/nuevo", color: "bg-orange-500" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
        <CardDescription>Accesos directos a las funciones más utilizadas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <Button key={index} variant="outline" className="h-20 flex-col gap-2" asChild>
              <a href={action.href}>
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm">{action.title}</span>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function InventoryStatus() {
  const categories = [
    { name: "Electrónicos", total: 85, inStock: 78, percentage: 92 },
    { name: "Ropa", total: 120, inStock: 95, percentage: 79 },
    { name: "Hogar", total: 40, inStock: 38, percentage: 95 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado del Inventario</CardTitle>
        <CardDescription>Disponibilidad por categoría</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{category.name}</span>
              <span className="text-muted-foreground">
                {category.inStock}/{category.total}
              </span>
            </div>
            <Progress value={category.percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function RecentActivity() {
  const activities = [
    {
      action: "Producto agregado",
      item: "Smartphone XYZ-123",
      time: "Hace 2 horas",
      type: "success",
      icon: Package,
    },
    {
      action: "Stock bajo detectado",
      item: "Auriculares ABC-456",
      time: "Hace 4 horas",
      type: "warning",
      icon: AlertTriangle,
    },
    {
      action: "Nuevo proveedor",
      item: "Distribuidora Tech",
      time: "Hace 6 horas",
      type: "info",
      icon: Truck,
    },
    {
      action: "Reporte generado",
      item: "Inventario Mensual",
      time: "Hace 1 día",
      type: "success",
      icon: TrendingUp,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
        <CardDescription>Últimas acciones en el sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div
                className={`p-2 rounded-full ${
                  activity.type === "success"
                    ? "bg-green-100 dark:bg-green-900"
                    : activity.type === "warning"
                      ? "bg-yellow-100 dark:bg-yellow-900"
                      : "bg-blue-100 dark:bg-blue-900"
                }`}
              >
                <activity.icon
                  className={`h-4 w-4 ${
                    activity.type === "success"
                      ? "text-green-600 dark:text-green-400"
                      : activity.type === "warning"
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-blue-600 dark:text-blue-400"
                  }`}
                />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-sm text-muted-foreground">{activity.item}</p>
              </div>
              <div className="text-xs text-muted-foreground">{activity.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function AlertsPanel({ lowStockProducts }: { lowStockProducts: Product[] }) {
  const alerts = [
    {
      title: "Stock Crítico",
      message: "8 productos requieren reabastecimiento inmediato",
      type: "error",
      action: "Ver Productos",
    },
    {
      title: "Orden Pendiente",
      message: "3 órdenes de compra esperan aprobación",
      type: "warning",
      action: "Revisar Órdenes",
    },
    {
      title: "Backup Completado",
      message: "Respaldo de datos realizado exitosamente",
      type: "success",
      action: "Ver Detalles",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Alertas del Sistema
        </CardTitle>
        <CardDescription>Notificaciones importantes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Alerta de Stock Crítico ahora es dinámica */}
        {lowStockProducts.length > 0 && (
          <div className="flex items-start space-x-4 p-3 rounded-lg border">
            <div className="p-1 rounded-full bg-red-100 dark:bg-red-900">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium">Stock Crítico</h4>
              <p className="text-sm text-muted-foreground">
                {lowStockProducts.length} producto(s) requieren reabastecimiento inmediato.
              </p>
              <Button variant="link" size="sm" className="h-auto p-0 mt-1" asChild>
                <a href="/dashboard/productos">Ver Productos</a>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
