"use client"

import React, { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Building, Phone, Mail, MapPin, CreditCard, FileText, User, Globe, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Proveedor } from "./types"
import { SupplierFormModal } from "./supplier-form-modal"

interface SupplierDrawerProps {
  proveedor: Proveedor
  onSuccess?: () => void
}

export function SupplierDrawer({ proveedor, onSuccess }: SupplierDrawerProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // --- LÓGICA PARA ELIMINAR ---
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/proveedores/${proveedor.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("No se pudo eliminar el proveedor")
      }

      toast.success("Proveedor eliminado correctamente")
      setIsDrawerOpen(false) // Cierra el drawer
      if (onSuccess) onSuccess() // Refresca la lista de proveedores
    } catch (error) {
      console.error("Error al eliminar el proveedor:", error)
      toast.error("Error al eliminar el proveedor")
    }
  }

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Ver Detalles
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="max-w-md w-full overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shadow-inner">
              <Building className="h-7 w-7 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-2xl font-extrabold tracking-tight">
                {proveedor.nombreEmpresa}
              </SheetTitle>
              <SheetDescription className="text-muted-foreground text-base">
                Detalles del Proveedor
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <Separator className="my-4" />

        {/* Información de la Empresa */}
        <div className="rounded-lg border bg-muted/50 p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Building className="h-4 w-4 text-primary" /> <h3 className="font-semibold">Información de la Empresa</h3>
            </div>
            <div className="space-y-2 text-sm">
                <p><span className="font-semibold">NIT/RUC:</span> {proveedor.nitRuc || "N/A"}</p>
                <p><span className="font-semibold">Tipo:</span> {proveedor.tipoProveedor || "N/A"}</p>
                <p><span className="font-semibold">Sitio Web:</span> {proveedor.sitioWeb || "N/A"}</p>
            </div>
        </div>
        
        {/* Contacto */}
        <div className="rounded-lg border bg-muted/50 p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-4 w-4 text-primary" /> <h3 className="font-semibold">Contacto</h3>
            </div>
            <div className="space-y-2 text-sm">
                <p><span className="font-semibold">Nombre:</span> {proveedor.personaContacto}</p>
                <p className="flex items-center gap-1"><Phone className="h-3 w-3" /> {proveedor.telefono}</p>
                <p className="flex items-center gap-1"><Mail className="h-3 w-3" /> {proveedor.email}</p>
            </div>
        </div>

        {/* Dirección */}
        <div className="rounded-lg border bg-muted/50 p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-primary" /> <h3 className="font-semibold">Dirección</h3>
            </div>
            <div className="space-y-2 text-sm">
                <p>{proveedor.direccion || "N/A"}</p>
                <p>{proveedor.ciudad || "N/A"}, {proveedor.pais || "N/A"} - {proveedor.codigoPostal || "N/A"}</p>
            </div>
        </div>

        {/* Condiciones Comerciales */}
         <div className="rounded-lg border bg-muted/50 p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-4 w-4 text-primary" /> <h3 className="font-semibold">Condiciones Comerciales</h3>
            </div>
            <div className="space-y-2 text-sm">
                <p><span className="font-semibold">Pago:</span> {proveedor.condicionesPago || "N/A"}</p>
                <p><span className="font-semibold">Días de Crédito:</span> {proveedor.diasCredito || 0}</p>
                <p><span className="font-semibold">Descuento:</span> {proveedor.descuentoGeneral || 0}%</p>
            </div>
        </div>

        {/* Notas */}
        <div className="rounded-lg border bg-muted/50 p-4 mb-4">
             <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-primary" /> <h3 className="font-semibold">Notas</h3>
            </div>
            <p className="text-sm text-muted-foreground">{proveedor.notasObservaciones || "Sin notas adicionales."}</p>
        </div><hr />

        <SheetFooter className="mt-8">
          <div className="flex w-full gap-2">
            {/* --- BOTÓN DE EDITAR --- */}
            <SupplierFormModal proveedor={proveedor} modoEdicion={true} onSuccess={onSuccess}>
               <Button variant="outline" className="w-full">
                <Edit className="h-4 w-4 mr-2" /> Editar
              </Button>
            </SupplierFormModal>

            {/* --- BOTÓN DE ELIMINAR --- */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro de eliminar este proveedor?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Se eliminará permanentemente el proveedor: <strong>{proveedor.nombreEmpresa}</strong>.
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