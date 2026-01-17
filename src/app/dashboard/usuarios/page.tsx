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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Users, UserCheck, Shield, ExternalLink, Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { clerkClient } from "@clerk/nextjs/server"
import Link from 'next/link'
import { ThemeSwitcher } from "@/app/components/theme-switcher"
import { NotificationBell } from "@/app/components/notification-bell"
import type { User } from "@clerk/nextjs/server"; 

// Definimos explícitamente el tipo para un usuario de Clerk para mejorar la autocompletado y seguridad de tipos.
type ClerkUser = User;

export default async function UsuariosPage() {
  
  // --- PASO 1: Obtenemos el cliente esperando la promesa de clerkClient() ---
  const client = await clerkClient();
  
  // --- PASO 2: Ahora sí, usamos el objeto 'client' para llamar a la API ---
  const userList = await client.users.getUserList({ limit: 50 });
  const usuarios = userList.data; // <-- array de usuarios
  const totalUsuarios = await client.users.getCount();
  
  const administradores = usuarios.filter(u => u.publicMetadata?.role === 'Administrador').length;
  const usuariosActivos = totalUsuarios; 

  const formatLastSignIn = (date: Date | null) => {
    if (!date) return 'Nunca';
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  // Función para obtener el nombre completo o un fallback
  const getFullName = (usuario: ClerkUser) => {
    if (usuario.firstName && usuario.lastName) {
      return `${usuario.firstName} ${usuario.lastName}`;
    }
    return usuario.username || usuario.emailAddresses[0]?.emailAddress || 'Usuario desconocido';
  };

  const usuariosOrdenados = [...usuarios].sort((a, b) => {
    const rolA = a.publicMetadata?.role === "Administrador" ? -1 : 1;
    const rolB = b.publicMetadata?.role === "Administrador" ? -1 : 1;
    return rolA - rolB;
  });

  return (
    <div className="dark">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background/80 backdrop-blur-md z-50 transition-all w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
               <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">SISGI</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Gestión de Usuarios</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-3">
              <ThemeSwitcher />
              <NotificationBell />
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50 text-xs font-medium">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span className="capitalize">
                  {new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
                <p className="text-muted-foreground">Administra usuarios, roles y permisos del sistema</p>
              </div>
              <Button asChild className="w-fit">
                <Link href="https://dashboard.clerk.com/users" target="_blank">
                  <Shield className="h-4 w-4 mr-2" />
                  Gestionar en Clerk
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalUsuarios}</div>
                  <p className="text-xs text-muted-foreground">Usuarios registrados en Clerk</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{usuariosActivos}</div>
                  <p className="text-xs text-muted-foreground">Actividad reciente</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Administradores</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{administradores}</div>
                  <p className="text-xs text-muted-foreground">Con rol de administrador</p>
                </CardContent>
              </Card>
            </div>

            <Card>
               <CardHeader>
                <CardTitle>Lista de Usuarios</CardTitle>
                <CardDescription>Mostrando los primeros {usuarios.length} usuarios de tu instancia de Clerk.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {usuariosOrdenados.map((usuario) => (
                    <div
                      key={usuario.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-4"
                    >
                      {/* Lado izquierdo: Avatar, Nombre y Email */}
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 flex-shrink-0">
                          <AvatarImage src={usuario.imageUrl} />
                          <AvatarFallback>
                            {usuario.firstName?.charAt(0)}
                            {usuario.lastName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{getFullName(usuario)}</p>
                          <p className="text-sm text-muted-foreground">{usuario.emailAddresses[0]?.emailAddress}</p>
                        </div>
                      </div>

                      {/* Lado derecho: Rol y Último Acceso */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                         <Badge variant={(usuario.publicMetadata?.role as string) === "Administrador" ? "default" : "secondary"}>
                           {(usuario.publicMetadata?.role as string) || 'Agente'}
                         </Badge>
                         <div className="text-sm text-muted-foreground text-right">
                            {formatLastSignIn(usuario.lastSignInAt ? new Date(usuario.lastSignInAt) : null)}
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