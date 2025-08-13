"use client"

import React, { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import {
    BarChart3, Package, Users, Truck, Settings, Home, ShoppingCart,
    FileText, Database, DollarSign
} from "lucide-react"
import { UserButton, useUser } from "@clerk/nextjs"
import { Skeleton } from "@/components/ui/skeleton"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator" // <-- Añadí Separator por si acaso

// ... (la constante navGroups que creamos antes se mantiene igual)
const navGroups = [
  {
    label: "Principal",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: Home, paths: ["/dashboard"] },
    ]
  },
  {
    label: "Gestión",
    items: [
      { title: "Productos", url: "/dashboard/productos", icon: Package, paths: ["/dashboard/productos"] },
      { title: "Ventas", url: "/dashboard/ventas", icon: DollarSign, paths: ["/dashboard/ventas"] },
      { title: "Órdenes de Compra", url: "/dashboard/ordenes", icon: ShoppingCart, paths: ["/dashboard/ordenes"] },
      { title: "Proveedores", url: "/dashboard/proveedores", icon: Truck, paths: ["/dashboard/proveedores"] },
    ]
  },
  {
    label: "Administración",
    items: [
      { title: "Usuarios", url: "/dashboard/usuarios", icon: Users, paths: ["/dashboard/usuarios"] },
      { title: "Reportes y Análisis", url: "/dashboard/reportes", icon: BarChart3, paths: ["/dashboard/reportes"] },
    ]
  },
  {
    label: "Herramientas",
    items: [
      { title: "Documentos", url: "/dashboard/documentos", icon: FileText, paths: ["/dashboard/documentos"] },
      { title: "Configuración", url: "/dashboard/configuracion", icon: Settings, paths: ["/dashboard/configuracion"] },
    ]
  }
];


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user } = useUser()

  // --- INICIO DE LA SOLUCIÓN ---
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  // --- FIN DE LA SOLUCIÓN ---

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
        </div>
        <Separator />
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.paths)}>
                      <a href={item.url} className="flex items-center gap-3 px-3 py-2">
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="flex-1">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        {/* --- SECCIÓN MODIFICADA PARA EVITAR EL ERROR --- */}
        <div className="px-3 py-2 flex items-center gap-2">
          {!isClient ? (
            <>
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </>
          ) : (
            <>
              <UserButton afterSignOutUrl="/" />
              <div className="flex-1">
                <p className="font-medium truncate">{user?.fullName || user?.username || "Usuario"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress || "Sin correo"}</p>
              </div>
            </>
          )}
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}