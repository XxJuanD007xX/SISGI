"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/app/components/app-sidebar"
import { DocumentUploadModal } from "@/app/components/DocumentUploadModal"
import { DashboardHeader } from "@/app/components/dashboard-header";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
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
  Image as ImageIcon,
  Video as VideoIcon
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
import { Carpeta, Documento } from "@/app/components/types"

export default function DocumentosPage() {
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null)
  const [folderHistory, setFolderHistory] = useState<{ id: number, name: string }[]>([])
  const [folders, setFolders] = useState<Carpeta[]>([])
  const [documents, setDocuments] = useState<Documento[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isPlaylistView, setIsPlaylistView] = useState(false)

  const fetchData = async () => {
    try {
      if (isPlaylistView) {
        const resDocs = await fetch(`http://localhost:8080/api/documentos/playlist`);
        if (resDocs.ok) setDocuments(await resDocs.json());
        setFolders([]);
        return;
      }

      const folderUrl = `http://localhost:8080/api/documentos/carpetas${currentFolderId ? `?parentId=${currentFolderId}` : ""}`;
      const docUrl = `http://localhost:8080/api/documentos${currentFolderId ? `?carpetaId=${currentFolderId}` : ""}`;

      const [resFolders, resDocs] = await Promise.all([
        fetch(folderUrl),
        fetch(docUrl)
      ]);

      if (resFolders.ok) setFolders(await resFolders.json());
      if (resDocs.ok) setDocuments(await resDocs.json());
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  }

  useEffect(() => {
    fetchData()
  }, [currentFolderId, isPlaylistView])

  const enterFolder = (folderId: number, folderName: string) => {
    setFolderHistory([...folderHistory, { id: folderId, name: folderName }])
    setCurrentFolderId(folderId)
    setSearchTerm("")
    setIsPlaylistView(false)
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
    setIsPlaylistView(false)
  }

  const handleDeleteFolder = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/documentos/carpetas/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Carpeta eliminada");
        fetchData();
      }
    } catch (error) {
      toast.error("Error al eliminar carpeta");
    }
  }

  const handleDeleteDocument = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/documentos/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Documento eliminado");
        fetchData();
      }
    } catch (error) {
      toast.error("Error al eliminar documento");
    }
  }

  const getFileIcon = (doc: Documento) => {
    if (doc.tipo === 'video') return <PlayCircle className="h-9 w-9 text-red-600" />;

    switch (doc.extension?.toLowerCase()) {
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

  const filteredFolders = folders.filter(f => f.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredDocs = documents.filter(d => d.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="dark">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader pageTitle="Repositorio de Documentos" />

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
                    placeholder={`Buscar...`}
                    className="pl-8 bg-background"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={isPlaylistView ? "default" : "outline"}
                  onClick={() => setIsPlaylistView(!isPlaylistView)}
                  className="gap-2"
                >
                  <VideoIcon className="h-4 w-4" /> Playlist
                </Button>
                <DocumentUploadModal currentFolderId={currentFolderId} onSuccess={fetchData}>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
                    <Plus className="h-5 w-5 mr-2" /> Nuevo
                  </Button>
                </DocumentUploadModal>
              </div>
            </div>

            <div className="flex-1 min-h-[500px]">
              {(filteredFolders.length === 0 && filteredDocs.length === 0) ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground border-2 border-dashed rounded-xl p-10">
                  <Folder className="h-16 w-16 mb-4 opacity-20" />
                  <p className="text-lg font-medium">No se encontraron elementos</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredFolders.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                        <Folder className="h-4 w-4" /> Carpetas
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredFolders.map(folder => {
                          const style = getColorClasses(folder.color);
                          return (
                            <div
                              key={folder.id}
                              className={`group relative flex flex-col items-center p-5 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${style.border} ${style.bg}`}
                              onClick={() => enterFolder(folder.id!, folder.nombre)}
                            >
                              <div className="mb-3 transition-transform group-hover:scale-110 duration-200">
                                <Folder className={`h-16 w-16 ${style.icon} fill-current`} />
                              </div>
                              <span className="text-sm font-semibold text-center truncate w-full px-2">
                                {folder.nombre}
                              </span>
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><MoreVertical className="h-4 w-4" /></Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteFolder(folder.id!)}>
                                      <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {filteredDocs.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-4 mt-6 flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Archivos
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredDocs.map(doc => (
                          <Card key={doc.id} className="group hover:border-primary/50 transition-all hover:shadow-lg">
                            <CardContent className="p-0 flex flex-col h-full">
                              <div className="flex items-center justify-between p-4 pb-3 border-b bg-muted/30">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-background rounded-lg shadow-sm">
                                    {getFileIcon(doc)}
                                  </div>
                                  <Badge variant="outline" className="text-[10px] uppercase">{doc.tipo}</Badge>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><MoreVertical className="h-4 w-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => window.open(`http://localhost:8080/api/documentos/download/${doc.id}`, '_blank')}>
                                        <Download className="mr-2 h-4 w-4" /> Descargar
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteDocument(doc.id!)}>
                                        <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                              <div className="flex-1 p-4 pt-3">
                                <p className="font-semibold text-sm mb-3 truncate" title={doc.nombre}>{doc.nombre}</p>
                                <div className="space-y-2 text-xs text-muted-foreground">
                                  <div className="flex justify-between"><span>Tamaño</span><span className="text-foreground">{doc.size}</span></div>
                                  <div className="flex justify-between"><span>Autor</span><span className="text-foreground truncate max-w-[100px]">{doc.autor}</span></div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
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
