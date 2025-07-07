"use client"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Package, Tag, Hash, DollarSign, FileText, User, MapPin } from "lucide-react"
import { useState } from "react"
import { Product } from "./types"
import { ProductFormModal } from "./product-form-modal"
 
 
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

export function ProductDrawer({ producto, onSuccess }: { producto: Product, onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [abrirModalEditar, setAbrirModalEditar] = useState(false) 

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetClose asChild>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Ver Detalles
        </Button>
      </SheetClose>
      <SheetContent side="right" className="max-w-md w-full">
        <SheetHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shadow-inner">
              <Package className="h-7 w-7 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-2xl font-extrabold tracking-tight">{producto.nombre}</SheetTitle>
              <SheetDescription className="text-muted-foreground text-base">
                Detalles del producto
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <Separator className="my-4" />

        {/* Información Básica */}
        <div className="rounded-lg border bg-muted/50 p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-lg">Información Básica</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-semibold">Descripción: </span>
              <span>{producto.descripcion || <span className="text-muted-foreground">Sin descripción</span>}</span>
            </div>
            <div>
              <span className="font-semibold">Categoría: </span>
              <Badge variant="secondary">{producto.categoria}</Badge>
            </div>
          </div>
        </div>

        {/* Inventario y Precios */}
        <div className="rounded-lg border bg-muted/50 p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Hash className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-lg">Inventario y Precios</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold flex items-center gap-1">
                <DollarSign className="h-3 w-3" /> Precio:
              </span>
              <span> ${producto.precio?.toLocaleString()}</span>
            </div>
            <div>
              <span className="font-semibold">Stock: </span>
              <span>{producto.stock}</span>
            </div>
            <div>
              <span className="font-semibold">Stock Mínimo: </span>
              <span>{producto.stockMinimo ?? <span className="text-muted-foreground">No definido</span>}</span>
            </div>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="rounded-lg border bg-muted/50 p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-lg">Información Adicional</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold flex items-center gap-1">
                <User className="h-3 w-3" /> Proveedor:
              </span>
              <span>{producto.proveedor || <span className="text-muted-foreground">Sin proveedor</span>}</span>
            </div>
            <div>
              <span className="font-semibold flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Ubicación:
              </span>
              <span>{producto.ubicacion || <span className="text-muted-foreground">Sin ubicación</span>}</span>
            </div>
          </div>
        </div><Separator className="my-4" />

        <SheetFooter className="mt-8">
          <div className="flex flex-col sm:flex-row sm:justify-end gap-2 w-full">
            {abrirModalEditar && (
              <ProductFormModal
                producto={producto}
                modoEdicion
                onSuccess={onSuccess}
              />
            )}
            
              <Button onClick={() => setAbrirModalEditar(true)}>Editar</Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. El producto será eliminado permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={async () => {
                      try {
                        const res = await fetch(`http://localhost:8080/api/products/${producto.id}`, {
                          method: "DELETE",
                        })
                        if (res.ok) {
                          toast.success("Producto eliminado correctamente")
                          window.location.reload() // Puedes reemplazar por router.refresh() si usas App Router
                        } else {
                          toast.error("No se pudo eliminar el producto")
                        }
                      } catch (error) {
                        toast.error("Error al conectar con el servidor")
                      }
                    }}
                  >
                    Confirmar eliminación
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

          </div>
          
        </SheetFooter>

      </SheetContent>

    </Sheet>
  )
}