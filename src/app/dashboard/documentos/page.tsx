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
import {
  FileText,
  Plus,
  Search,
  Download,
  Eye,
  Calendar,
  User,
  FolderOpen,
  BookOpen,
  Settings,
  Shield,
  HelpCircle,
  FileCode,
  ImageIcon,
  Video,
  Archive,
} from "lucide-react"
import { useState } from "react"

export default function DocumentosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("todos")

  const documentos = [
    {
      id: 1,
      nombre: "Manual de Usuario SISGI v2.1",
      descripcion: "Guía completa para el uso del sistema de gestión de inventarios",
      categoria: "manuales",
      tipo: "PDF",
      tamaño: "2.4 MB",
      fechaCreacion: "2024-01-15",
      fechaModificacion: "2024-01-20",
      autor: "Equipo de Desarrollo",
      version: "2.1.0",
      icono: BookOpen,
      estado: "Actualizado",
    },
    {
      id: 2,
      nombre: "Guía de Instalación",
      descripcion: "Instrucciones paso a paso para la instalación del sistema",
      categoria: "tecnica",
      tipo: "PDF",
      tamaño: "1.8 MB",
      fechaCreacion: "2024-01-10",
      fechaModificacion: "2024-01-15",
      autor: "Administrador de Sistema",
      version: "1.0.0",
      icono: Settings,
      estado: "Vigente",
    },
    {
      id: 3,
      nombre: "Políticas de Seguridad",
      descripcion: "Normativas y políticas de seguridad del sistema",
      categoria: "politicas",
      tipo: "DOCX",
      tamaño: "856 KB",
      fechaCreacion: "2024-01-05",
      fechaModificacion: "2024-01-12",
      autor: "Departamento Legal",
      version: "1.2.0",
      icono: Shield,
      estado: "Vigente",
    },
    {
      id: 4,
      nombre: "API Documentation",
      descripcion: "Documentación técnica de la API REST del sistema",
      categoria: "tecnica",
      tipo: "HTML",
      tamaño: "3.2 MB",
      fechaCreacion: "2024-01-08",
      fechaModificacion: "2024-01-18",
      autor: "Equipo Backend",
      version: "2.0.0",
      icono: FileCode,
      estado: "Actualizado",
    },
    {
      id: 5,
      nombre: "Tutorial de Primeros Pasos",
      descripcion: "Video tutorial para nuevos usuarios del sistema",
      categoria: "tutoriales",
      tipo: "MP4",
      tamaño: "45.2 MB",
      fechaCreacion: "2024-01-12",
      fechaModificacion: "2024-01-12",
      autor: "Equipo de Capacitación",
      version: "1.0.0",
      icono: Video,
      estado: "Nuevo",
    },
    {
      id: 6,
      nombre: "Preguntas Frecuentes (FAQ)",
      descripcion: "Respuestas a las consultas más comunes de los usuarios",
      categoria: "ayuda",
      tipo: "PDF",
      tamaño: "1.2 MB",
      fechaCreacion: "2024-01-14",
      fechaModificacion: "2024-01-19",
      autor: "Soporte Técnico",
      version: "1.1.0",
      icono: HelpCircle,
      estado: "Actualizado",
    },
    {
      id: 7,
      nombre: "Diagramas de Arquitectura",
      descripcion: "Esquemas técnicos de la arquitectura del sistema",
      categoria: "tecnica",
      tipo: "PNG",
      tamaño: "2.8 MB",
      fechaCreacion: "2024-01-06",
      fechaModificacion: "2024-01-16",
      autor: "Arquitecto de Software",
      version: "1.0.0",
      icono: ImageIcon,
      estado: "Vigente",
    },
    {
      id: 8,
      nombre: "Backup de Configuraciones",
      descripcion: "Archivo de respaldo de configuraciones del sistema",
      categoria: "respaldos",
      tipo: "ZIP",
      tamaño: "5.1 MB",
      fechaCreacion: "2024-01-20",
      fechaModificacion: "2024-01-20",
      autor: "Sistema Automático",
      version: "Auto",
      icono: Archive,
      estado: "Reciente",
    },
  ]

  const categorias = [
    { id: "todos", nombre: "Todos los Documentos", icono: FolderOpen, count: documentos.length },
    {
      id: "manuales",
      nombre: "Manuales de Usuario",
      icono: BookOpen,
      count: documentos.filter((d) => d.categoria === "manuales").length,
    },
    {
      id: "tecnica",
      nombre: "Documentación Técnica",
      icono: FileCode,
      count: documentos.filter((d) => d.categoria === "tecnica").length,
    },
    {
      id: "politicas",
      nombre: "Políticas y Normativas",
      icono: Shield,
      count: documentos.filter((d) => d.categoria === "politicas").length,
    },
    {
      id: "tutoriales",
      nombre: "Tutoriales y Videos",
      icono: Video,
      count: documentos.filter((d) => d.categoria === "tutoriales").length,
    },
    {
      id: "ayuda",
      nombre: "Ayuda y Soporte",
      icono: HelpCircle,
      count: documentos.filter((d) => d.categoria === "ayuda").length,
    },
    {
      id: "respaldos",
      nombre: "Respaldos",
      icono: Archive,
      count: documentos.filter((d) => d.categoria === "respaldos").length,
    },
  ]

  const documentosFiltrados = documentos.filter((doc) => {
    const matchesSearch =
      doc.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "todos" || doc.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Nuevo":
        return (
          <Badge variant="default" className="bg-green-600">
            Nuevo
          </Badge>
        )
      case "Actualizado":
        return (
          <Badge variant="default" className="bg-blue-600">
            Actualizado
          </Badge>
        )
      case "Vigente":
        return <Badge variant="secondary">Vigente</Badge>
      case "Reciente":
        return (
          <Badge variant="default" className="bg-purple-600">
            Reciente
          </Badge>
        )
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />
      case "docx":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "html":
        return <FileCode className="h-4 w-4 text-orange-500" />
      case "mp4":
        return <Video className="h-4 w-4 text-purple-500" />
      case "png":
      case "jpg":
        return <ImageIcon className="h-4 w-4 text-green-500" />
      case "zip":
        return <Archive className="h-4 w-4 text-gray-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

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
                  <BreadcrumbPage>Documentos</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Centro de Documentación</h1>
                <p className="text-muted-foreground">Accede a manuales, guías y documentación técnica de SISGI</p>
              </div>
              <Button className="w-fit">
                <Plus className="h-4 w-4 mr-2" />
                Subir Documento
              </Button>
            </div>

            {/* Search and Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="md:col-span-3">
                <CardContent className="p-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar documentos..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{documentos.length}</div>
                    <p className="text-sm text-muted-foreground">Documentos Totales</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Categories and Content */}
            <div className="grid gap-4 md:grid-cols-4">
              {/* Categories Sidebar */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categorías</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {categorias.map((categoria) => (
                      <button
                        key={categoria.id}
                        onClick={() => setSelectedCategory(categoria.id)}
                        className={`w-full flex items-center justify-between p-3 text-left hover:bg-muted/50 transition-colors ${
                          selectedCategory === categoria.id ? "bg-muted" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <categoria.icono className="h-4 w-4" />
                          <span className="text-sm">{categoria.nombre}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {categoria.count}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Documents List */}
              <div className="md:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {selectedCategory === "todos"
                        ? "Todos los Documentos"
                        : categorias.find((c) => c.id === selectedCategory)?.nombre}
                    </CardTitle>
                    <CardDescription>{documentosFiltrados.length} documento(s) encontrado(s)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {documentosFiltrados.map((documento) => (
                        <div key={documento.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start space-x-4 flex-1">
                              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                                <documento.icono className="h-6 w-6" />
                              </div>
                              <div className="flex-1 space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="font-medium text-lg">{documento.nombre}</h3>
                                  {getEstadoBadge(documento.estado)}
                                </div>
                                <p className="text-sm text-muted-foreground">{documento.descripcion}</p>
                                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    {getTipoIcon(documento.tipo)}
                                    <span>{documento.tipo}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Archive className="h-3 w-3" />
                                    <span>{documento.tamaño}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{documento.fechaModificacion}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    <span>{documento.autor}</span>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    v{documento.version}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-row sm:flex-col gap-2 sm:gap-2 justify-end">
                              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                <Eye className="h-4 w-4 mr-0" />
                                <span className="hidden sm:inline ml-1">Ver</span>
                              </Button>
                              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                <Download className="h-4 w-4 mr-0" />
                                <span className="hidden sm:inline ml-1">Descargar</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {documentosFiltrados.length === 0 && (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No se encontraron documentos</h3>
                        <p className="text-muted-foreground">
                          {searchTerm
                            ? `No hay documentos que coincidan con "${searchTerm}"`
                            : "No hay documentos en esta categoría"}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Access */}
            <Card>
              <CardHeader>
                <CardTitle>Acceso Rápido</CardTitle>
                <CardDescription>Documentos más utilizados y recientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {documentos.slice(0, 4).map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <doc.icono className="h-5 w-5 text-primary" />
                        <span className="font-medium text-sm">{doc.nombre}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{doc.descripcion}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {doc.tipo}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Download className="h-3 w-3" />
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
