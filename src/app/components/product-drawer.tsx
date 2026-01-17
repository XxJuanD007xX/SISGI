"use client"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Package, Tag, Hash, DollarSign, FileText, User, MapPin, Edit, Trash2, QrCode, Bookmark } from "lucide-react"
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

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/products/${producto.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Producto eliminado correctamente");
        if (onSuccess) onSuccess();
      } else {
        toast.error("No se pudo eliminar el producto");
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Ver Detalles
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="max-w-md w-full overflow-y-auto">
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

        {/* --- Información Básica (ACTUALIZADA) --- */}
        <div className="rounded-lg border bg-muted/50 p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-lg">Información Básica</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold flex items-center gap-1"><Bookmark className="h-3 w-3" /> Categoría: </span>
              <Badge variant="secondary">{producto.categoria}</Badge>
            </div>
            <div>
              <span className="font-semibold flex items-center gap-1"><Bookmark className="h-3 w-3" /> Marca: </span>
              <span>{producto.marca || <span className="text-muted-foreground">N/A</span>}</span>
            </div>
            <div>
              <span className="font-semibold flex items-center gap-1"><QrCode className="h-3 w-3" /> Código de Barras: </span>
              <span>{producto.codigoBarras || <span className="text-muted-foreground">No definido</span>}</span>
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="font-semibold">Descripción: </span>
            <span>{producto.descripcion || <span className="text-muted-foreground">Sin descripción</span>}</span>
          </div>
        </div>
        <div className="rounded-lg border bg-muted/50 p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Hash className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-lg">Inventario y Precios</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="font-semibold flex items-center gap-1"><DollarSign className="h-3 w-3" /> Precio:</span> ${producto.precio?.toLocaleString()}</div>
            <div><span className="font-semibold">Stock:</span> {producto.stock}</div>
            <div><span className="font-semibold">Stock Mínimo:</span> {producto.stockMinimo ?? <span className="text-muted-foreground">N/A</span>}</div>
          </div>
        </div>
        <div className="rounded-lg border bg-muted/50 p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-lg">Información Adicional</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="font-semibold">Proveedor:</span> {producto.proveedor?.nombreEmpresa || <span className="text-muted-foreground">N/A</span>}</div>
            <div><span className="font-semibold">Ubicación:</span> {producto.ubicacion || <span className="text-muted-foreground">N/A</span>}</div>
          </div>
        </div>
        <Separator className="my-4" />

        <SheetFooter className="mt-8">
          <div className="flex w-full gap-2">
            <ProductFormModal producto={producto} modoEdicion={true} onSuccess={onSuccess}>
               <Button variant="outline" className="w-full">
                <Edit className="h-4 w-4 mr-2" /> Editar
              </Button>
            </ProductFormModal>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro de eliminar este producto?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Se eliminará permanentemente el producto: <strong>{producto.nombre}</strong>.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
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