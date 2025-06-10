"use client"

import type * as React from "react"
import { usePathname } from "next/navigation"
import { BarChart3, Package, Users, Truck, Settings, Home, Bell, Calendar, FileText, Database } from "lucide-react"
import { UserButton, useUser } from "@clerk/nextjs"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

// Datos de navegación
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      paths: ["/dashboard"],
    },
    {
      title: "Usuarios",
      url: "/dashboard/usuarios",
      icon: Users,
      badge: "12",
      paths: ["/dashboard/usuarios"],
      items: [
        { title: "Todos los Usuarios", url: "/dashboard/usuarios" },
        { title: "Roles y Permisos", url: "/dashboard/usuarios/roles" },
        { title: "Nuevo Usuario", url: "/dashboard/usuarios/nuevo" },
      ],
    },
    {
      title: "Productos",
      url: "/dashboard/productos",
      icon: Package,
      badge: "245",
      paths: ["/dashboard/productos"],
      items: [
        { title: "Inventario", url: "/dashboard/productos" },
        { title: "Categorías", url: "/dashboard/productos/categorias" },
        { title: "Stock Bajo", url: "/dashboard/productos/stock-bajo", alert: true },
        { title: "Nuevo Producto", url: "/dashboard/productos/nuevo" },
      ],
    },
    {
      title: "Proveedores",
      url: "/dashboard/proveedores",
      icon: Truck,
      badge: "18",
      paths: ["/dashboard/proveedores"],
      items: [
        { title: "Todos los Proveedores", url: "/dashboard/proveedores" },
        { title: "Órdenes de Compra", url: "/dashboard/proveedores/ordenes" },
        { title: "Nuevo Proveedor", url: "/dashboard/proveedores/nuevo" },
      ],
    },
    {
      title: "Reportes y Análisis",
      url: "/dashboard/reportes",
      icon: BarChart3,
      paths: ["/dashboard/reportes"],
      items: [
        { title: "Dashboard Analítico", url: "/dashboard/reportes" },
        { title: "Reportes de Ventas", url: "/dashboard/reportes/ventas" },
        { title: "Reportes de Inventario", url: "/dashboard/reportes/inventario" },
        { title: "Análisis de Tendencias", url: "/dashboard/reportes/tendencias" },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Notificaciones",
      url: "/dashboard/notificaciones",
      icon: Bell,
      badge: "3",
      paths: ["/dashboard/notificaciones"],
    },
    {
      title: "Calendario",
      url: "/dashboard/calendario",
      icon: Calendar,
      paths: ["/dashboard/calendario"],
    },
    {
      title: "Documentos",
      url: "/dashboard/documentos",
      icon: FileText,
      paths: ["/dashboard/documentos"],
    },
    {
      title: "Configuración",
      url: "/dashboard/configuracion",
      icon: Settings,
      paths: ["/dashboard/configuracion"],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user } = useUser()

  const isActive = (paths: string[]) => {
    return paths.some((path) => pathname === path || pathname.startsWith(path + "/"))
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Database className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">SISGI</span>
            <span className="truncate text-xs text-muted-foreground">Variedades Dipal</span>
          </div>
        </div><hr />
      </SidebarHeader>

      <SidebarContent>
        {/* Navegación Principal */}
        <SidebarGroup>
          <SidebarGroupLabel>Módulos Principales</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.paths)}>
                    <a href={item.url} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="h-5 px-2 text-xs font-medium">
                          {item.badge}
                        </Badge>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Navegación Secundaria */}
        <SidebarGroup>
          <hr /><SidebarGroupLabel>Herramientas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.paths)}>
                    <a href={item.url} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge variant="destructive" className="h-5 px-2 text-xs font-medium">
                          {item.badge}
                        </Badge>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Estado del Sistema */}
        <SidebarGroup>
          <hr /><SidebarGroupLabel>Estado del Sistema</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-3 py-2 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Servidor</span>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-green-500">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Base de Datos</span>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-green-500">Conectada</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Último Backup</span>
                <span className="text-xs text-muted-foreground">Hace 2h</span>
              </div>
            </div><hr />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-3 py-2 flex items-center gap-2">
          <UserButton afterSignOutUrl="/" />
          <div className="flex-1">
            <p className="font-medium">
              {user?.fullName || user?.username || "Usuario"}
            </p>
            <p className="text-xs text-muted-foreground">
              {user?.primaryEmailAddress?.emailAddress || "Sin correo"}
            </p>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
