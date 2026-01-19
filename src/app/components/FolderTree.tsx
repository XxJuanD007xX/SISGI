"use client"

import React, { useState } from "react"
import {
    ChevronRight,
    ChevronDown,
    Folder,
    FolderOpen,
    MoreHorizontal
} from "lucide-react"
import { Carpeta } from "./types"
import { cn } from "@/lib/utils"

interface FolderTreeProps {
    folders: Carpeta[]
    currentFolderId: number | null
    onSelectFolder: (id: number, name: string) => void
    level?: number
}

export function FolderTree({ folders, currentFolderId, onSelectFolder, level = 0 }: FolderTreeProps) {
    const [expandedFolders, setExpandedFolders] = useState<Record<number, boolean>>({})

    const toggleExpand = (e: React.MouseEvent, id: number) => {
        e.stopPropagation()
        setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }))
    }

    if (folders.length === 0 && level === 0) {
        return <div className="text-xs text-muted-foreground p-4">No hay carpetas</div>
    }

    return (
        <div className={cn("space-y-1", level > 0 && "ml-4 border-l pl-2")}>
            {folders.map(folder => (
                <div key={folder.id} className="space-y-1">
                    <div
                        className={cn(
                            "group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors hover:bg-muted/50",
                            currentFolderId === folder.id && "bg-primary/10 text-primary font-medium"
                        )}
                        onClick={() => onSelectFolder(folder.id!, folder.nombre)}
                    >
                        <button
                            onClick={(e) => toggleExpand(e, folder.id!)}
                            className="p-0.5 hover:bg-muted rounded text-muted-foreground"
                        >
                            {expandedFolders[folder.id!] ? (
                                <ChevronDown className="h-3.5 w-3.5" />
                            ) : (
                                <ChevronRight className="h-3.5 w-3.5" />
                            )}
                        </button>
                        {expandedFolders[folder.id!] ? (
                            <FolderOpen className={cn("h-4 w-4", currentFolderId === folder.id ? "text-primary" : "text-amber-500")} />
                        ) : (
                            <Folder className={cn("h-4 w-4", currentFolderId === folder.id ? "text-primary" : "text-amber-500")} />
                        )}
                        <span className="text-sm truncate flex-1">{folder.nombre}</span>
                    </div>

                    {expandedFolders[folder.id!] && folder.subcarpetas && (
                        <FolderTree
                            folders={folder.subcarpetas}
                            currentFolderId={currentFolderId}
                            onSelectFolder={onSelectFolder}
                            level={level + 1}
                        />
                    )}
                </div>
            ))}
        </div>
    )
}
