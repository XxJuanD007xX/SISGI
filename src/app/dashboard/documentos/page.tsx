"use client"

import { useState } from "react"
import { AppSidebar } from "@/app/components/app-sidebar"
import { DocumentUploadModal, DriveItem } from "@/app/components/DocumentUploadModal"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {
  Search,
  Folder,
  FileText,
  MoreVertical,
  ArrowLeft,
  Download,
  Trash2,
  ExternalLink,
  PlayCircle,
  Plus,
  FileSpreadsheet,
  FileIcon,
  Presentation,
  Image as ImageIcon
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import React from "react"

// Datos iniciales con archivos en raíz y en carpetas
const initialItems: DriveItem[] = [
  // Carpetas
  { id: "folder-1", parentId: null, name: "Manuales y Guías", type: "folder", color: "text-blue-500", createdAt: "01/01/2024", updatedAt: "01/01/2024", author: "Admin" },
  { id: "folder-2", parentId: null, name: "Legal", type: "folder", color: "text-emerald-500", createdAt: "01/01/2024", updatedAt: "05/01/2024", author: "Legal" },
  { id: "folder-3", parentId: null, name: "Marketing", type: "folder", color: "text-purple-500", createdAt: "01/02/2024", updatedAt: "01/02/2024", author: "Mkt Team" },

  // Archivos sueltos en raíz (Dashboard/Documentos)
  { id: "doc-root-1", parentId: null, name: "Reporte Anual 2024.xlsx", type: "file", fileType: "xlsx", category: "general", size: "1.2 MB", createdAt: "10/02/2024", updatedAt: "10/02/2024", author: "Finanzas" },
  { id: "doc-root-2", parentId: null, name: "Presentación Corporativa.pptx", type: "file", fileType: "pptx", category: "marketing", size: "5.8 MB", createdAt: "12/02/2024", updatedAt: "12/02/2024", author: "Gerencia" },

  // Contenido dentro de carpetas
  { id: "doc-1", parentId: "folder-1", name: "Manual de Usuario v2.pdf", type: "file", fileType: "pdf", category: "manuales", size: "2.4 MB", createdAt: "15/01/2024", updatedAt: "15/01/2024", author: "Dev Team" },
  { id: "vid-1", parentId: "folder-1", name: "Tutorial: Registro de Productos", type: "video", url: "https://youtube.com", createdAt: "20/01/2024", updatedAt: "20/01/2024", author: "Soporte" },
]

export default function DocumentosPage() {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [folderHistory, setFolderHistory] = useState<{ id: string, name: string }[]>([])
  const [items, setItems] = useState<DriveItem[]>(initialItems)
  const [searchTerm, setSearchTerm] = useState("")

  // --- NAVEGACIÓN ---
  const enterFolder = (folderId: string, folderName: string) => {
    setFolderHistory([...folderHistory, { id: folderId, name: folderName }])
    setCurrentFolderId(folderId)
    setSearchTerm("")
  }

  const navigateUp = () => {
    if (folderHistory.length === 0) return;
    const newHistory = [...folderHistory];
    newHistory.pop();
    setFolderHistory(newHistory);
    setCurrentFolderId(newHistory.length > 0 ? newHistory[newHistory.length - 1].id : null);
  }

  const navigateToBreadcrumb = (index: number) => {
    if (index === -1) {
      setFolderHistory([]);
      setCurrentFolderId(null);
    } else {
      const newHistory = folderHistory.slice(0, index + 1);
      setFolderHistory(newHistory);
      setCurrentFolderId(newHistory[newHistory.length - 1].id);
    }
  }

  const handleNewItem = (item: DriveItem) => {
    setItems(prev => [item, ...prev])
  }

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast.success("Elemento eliminado");
  }

  // --- RENDERIZADO DE ICONOS ---
  const getFileIcon = (fileType?: string, type?: string) => {
    if (type === 'video') return <PlayCircle className="h-9 w-9 text-red-600" />;

    switch (fileType?.toLowerCase()) {
      case 'pdf': return <FileText className="h-9 w-9 text-red-500" />;
      case 'xls':
      case 'xlsx':
      case 'csv': return <FileSpreadsheet className="h-9 w-9 text-emerald-600" />;
      case 'doc':
      case 'docx': return <FileText className="h-9 w-9 text-blue-600" />;
      case 'ppt':
      case 'pptx': return <Presentation className="h-9 w-9 text-orange-500" />;
      case 'png':
      case 'jpg':
      case 'jpeg': return <ImageIcon className="h-9 w-9 text-purple-500" />;
      default: return <FileIcon className="h-9 w-9 text-gray-400" />;
    }
  }

  const displayedItems = items.filter(item => {
    if (searchTerm) return item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return item.parentId === currentFolderId;
  });

  const folders = displayedItems.filter(i => i.type === 'folder');
  const files = displayedItems.filter(i => i.type !== 'folder');

  // Mapeo de colores para carpetas (borde principal, fondo suave)
  const getColorClasses = (colorName: string | undefined) => {
    const colorMap: Record<string, { border: string; icon: string; bg: string }> = {
      'text-blue-500': { border: 'border-blue-500/60', icon: 'text-blue-500/80', bg: 'bg-blue-50/50 dark:bg-blue-950/20' },
      'text-red-500': { border: 'border-red-500/60', icon: 'text-red-500/80', bg: 'bg-red-50/50 dark:bg-red-950/20' },
      'text-emerald-500': { border: 'border-emerald-500/60', icon: 'text-emerald-500/80', bg: 'bg-emerald-50/50 dark:bg-emerald-950/20' },
      'text-purple-500': { border: 'border-purple-500/60', icon: 'text-purple-500/80', bg: 'bg-purple-50/50 dark:bg-purple-950/20' },
      'text-amber-500': { border: 'border-amber-500/60', icon: 'text-amber-500/80', bg: 'bg-amber-50/50 dark:bg-amber-950/20' },
      'text-pink-500': { border: 'border-pink-500/60', icon: 'text-pink-500/80', bg: 'bg-pink-50/50 dark:bg-pink-950/20' },
    };
    return colorMap[colorName || 'text-blue-500'] || colorMap['text-blue-500'];
  }

  // Obtener badge de categoría
  const getCategoryBadge = (category?: string, type?: string) => {
    if (type === 'video') return { label: 'Video', color: 'bg-red-500/10 text-red-600 border-red-200/50' };

    const categoryMap: Record<string, { label: string; color: string }> = {
      'general': { label: 'General', color: 'bg-slate-500/10 text-slate-600 border-slate-200/50' },
      'manuales': { label: 'Manual', color: 'bg-blue-500/10 text-blue-600 border-blue-200/50' },
      'tecnica': { label: 'Técnica', color: 'bg-purple-500/10 text-purple-600 border-purple-200/50' },
      'legal': { label: 'Legal', color: 'bg-amber-500/10 text-amber-600 border-amber-200/50' },
      'marketing': { label: 'Marketing', color: 'bg-pink-500/10 text-pink-600 border-pink-200/50' },
    };
    return categoryMap[category || 'general'] || categoryMap['general'];
  }

  return (
    <div className="dark">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            {/* --- BREADCRUMBS --- */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />

                <BreadcrumbItem>
                  {currentFolderId === null ? (
                    <BreadcrumbPage>Documentos</BreadcrumbPage>
                  ) : (
                    <button
                      onClick={() => navigateToBreadcrumb(-1)}
                      className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      Documentos
                    </button>
                  )}
                </BreadcrumbItem>

                {folderHistory.map((folder, index) => (
                  <React.Fragment key={folder.id}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {index === folderHistory.length - 1 ? (
                        <BreadcrumbPage>{folder.name}</BreadcrumbPage>
                      ) : (
                        <button
                          onClick={() => navigateToBreadcrumb(index)}
                          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                          {folder.name}
                        </button>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30 p-2 rounded-lg border">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {currentFolderId && (
                  <Button variant="ghost" size="icon" onClick={navigateUp} title="Subir nivel">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                )}
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={`Buscar en ${currentFolderId ? 'esta carpeta' : 'Documentos'}...`}
                    className="pl-8 bg-background"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <DocumentUploadModal currentFolderId={currentFolderId} onUpload={handleNewItem}>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
                  <Plus className="h-5 w-5 mr-2" /> Nuevo
                </Button>
              </DocumentUploadModal>
            </div>

            <div className="flex-1 min-h-[500px]">

              {displayedItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground border-2 border-dashed rounded-xl p-10">
                  <Folder className="h-16 w-16 mb-4 opacity-20" />
                  <p className="text-lg font-medium">Carpeta vacía</p>
                  <p className="text-sm">Usa el botón "Nuevo" para agregar contenido</p>
                </div>
              ) : (
                <div className="space-y-8">

                  {/* --- CARPETAS --- */}
                  {folders.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                        <Folder className="h-4 w-4" /> Carpetas
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {folders.map(folder => {
                          const style = getColorClasses(folder.color);
                          return (
                            <div
                              key={folder.id}
                              className={`group relative flex flex-col items-center p-5 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${style.border} ${style.bg}`}
                              onClick={() => enterFolder(folder.id, folder.name)}
                            >
                              <div className="mb-3 transition-transform group-hover:scale-110 duration-200">
                                <Folder className={`h-16 w-16 ${style.icon} fill-current`} />
                              </div>
                              <span className="text-sm font-semibold text-center truncate w-full px-2">
                                {folder.name}
                              </span>
                              <span className="text-[11px] text-muted-foreground mt-1.5">{folder.createdAt}</span>

                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                <ItemMenu item={folder} onDelete={handleDelete} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* --- ARCHIVOS --- */}
                  {files.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-4 mt-6 flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Archivos
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {files.map(file => {
                          const categoryBadge = getCategoryBadge(file.category, file.type);
                          return (
                            <Card key={file.id} className="group hover:border-primary/50 transition-all hover:shadow-lg">
                              <CardContent className="p-0 flex flex-col h-full">
                                {/* Header con icono y menú */}
                                <div className="flex items-center justify-between p-4 pb-3 border-b bg-muted/30">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-background rounded-lg shadow-sm">
                                      {getFileIcon(file.fileType, file.type)}
                                    </div>
                                    <Badge variant="outline" className={`text-[10px] font-semibold px-2 py-0.5 ${categoryBadge.color}`}>
                                      {categoryBadge.label}
                                    </Badge>
                                  </div>
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                    <ItemMenu item={file} onDelete={handleDelete} />
                                  </div>
                                </div>

                                {/* Contenido */}
                                <div className="flex-1 p-4 pt-3">
                                  <p className="font-semibold text-sm mb-3 truncate" title={file.name}>{file.name}</p>

                                  <div className="space-y-2 text-xs">
                                    <div className="flex items-center justify-between text-muted-foreground">
                                      <span className="flex items-center gap-1.5">
                                        <div className="h-1 w-1 rounded-full bg-muted-foreground"></div>
                                        Tamaño
                                      </span>
                                      <span className="font-medium text-foreground">{file.size || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-muted-foreground">
                                      <span className="flex items-center gap-1.5">
                                        <div className="h-1 w-1 rounded-full bg-muted-foreground"></div>
                                        Fecha
                                      </span>
                                      <span className="font-medium text-foreground">{file.createdAt}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-muted-foreground">
                                      <span className="flex items-center gap-1.5">
                                        <div className="h-1 w-1 rounded-full bg-muted-foreground"></div>
                                        Autor
                                      </span>
                                      <span className="font-medium text-foreground truncate max-w-[120px]">{file.author}</span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

function ItemMenu({ item, onDelete }: { item: DriveItem, onDelete: (id: string) => void }) {
  const handleAction = (action: string) => {
    if (action === 'open') {
      if (item.type === 'video' && item.url) {
        window.open(item.url, '_blank');
      } else {
        toast.info(`Abriendo ${item.name}...`);
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleAction('open')}>
          {item.type === 'video' ? <ExternalLink className="mr-2 h-4 w-4" /> : <FileText className="mr-2 h-4 w-4" />}
          Abrir / Ver
        </DropdownMenuItem>
        {item.type === 'file' && (
          <DropdownMenuItem onClick={() => toast.success("Descargando...")}>
            <Download className="mr-2 h-4 w-4" /> Descargar
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(item.id)}>
          <Trash2 className="mr-2 h-4 w-4" /> Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}