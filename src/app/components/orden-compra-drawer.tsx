// src/app/components/orden-compra-drawer.tsx

"use client"

import React from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger } from "@/components/ui/sheet"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Edit, Trash2, Calendar, DollarSign, Building, FileText, Download, Package, Mail } from "lucide-react"
import { toast } from "sonner"
import { OrdenCompra } from "./types"
import { OrdenCompraFormModal } from "./orden-compra-form-modal"
import { EmailFormModal } from "./email-form-modal";

interface OrdenDrawerProps {
  orden: OrdenCompra
  onSuccess?: () => void
}

export function OrdenCompraDrawer({ orden, onSuccess }: OrdenDrawerProps) {

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/ordenes/${orden.id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("No se pudo eliminar la orden")
      toast.success("Orden eliminada correctamente")
      if (onSuccess) onSuccess()
    } catch (error) {
       toast.error("Error al eliminar la orden")
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/ordenes/${orden.id}/pdf`);
      if (!response.ok) {
        // Si el backend falla, esto se activa.
        throw new Error("No se pudo generar el PDF.");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orden_compra_${orden.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("PDF descargado con éxito.");
    } catch (error) {
      console.error("Error al descargar el PDF:", error);
      toast.error("No se pudo descargar el PDF.");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">Ver Detalles</Button>
      </SheetTrigger>
      <SheetContent className="max-w-md w-full overflow-y-auto">
        <SheetHeader>
            <div className="flex items-center gap-3 mb-2">
                 <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shadow-inner">
                    <ShoppingCart className="h-7 w-7 text-primary" />
                </div>
                <div>
                    <SheetTitle className="text-2xl font-bold">Orden de Compra #{orden.id}</SheetTitle>
                    {/* === CORRECCIÓN 1 === */}
                    <SheetDescription className="text-base">{orden.proveedor?.nombreEmpresa || 'Proveedor no asignado'}</SheetDescription>
                </div>
            </div>
        </SheetHeader>
        <Separator className="my-4" />

        <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center">
                <span className="font-semibold text-muted-foreground">Estado</span>
                <Badge>{orden.estado}</Badge>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-semibold text-muted-foreground">Fecha</span>
                <span>{new Date(orden.fechaOrden).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
             <div className="flex justify-between items-center">
                <span className="font-semibold text-muted-foreground">Total</span>
                <span className="font-bold text-lg">{orden.total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
            </div>
        </div>
        
        <Separator className="my-4" />

        <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2"><Building className="h-4 w-4"/> Proveedor</h4>
            <div className="pl-6 text-sm text-muted-foreground">
                {/* === CORRECCIÓN 2 === */}
                <p>{orden.proveedor?.nombreEmpresa || 'N/A'}</p>
                <p>{orden.proveedor?.personaContacto || 'N/A'}</p>
                <p>{orden.proveedor?.email || 'N/A'}</p>
            </div>
        </div>
        
        <div className="space-y-3 mt-4">
            <h4 className="font-semibold flex items-center gap-2"><FileText className="h-4 w-4"/> Observaciones</h4>
            <p className="pl-6 text-sm text-muted-foreground italic">{orden.observaciones || "Sin observaciones."}</p>
        </div>

        {/* --- SECCIÓN PARA MOSTRAR DETALLES (TAMBIÉN PROTEGIDA) --- */}
        <Separator className="my-4" />
        <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2"><Package className="h-4 w-4"/> Productos Incluidos</h4>
            <div className="pl-6 space-y-2">
                {orden.detalles?.map(detalle => (
                    <div key={detalle.id} className="flex justify-between items-center text-sm">
                        <div>
                            {/* === CORRECCIÓN 3 === */}
                            <p className="font-medium">{detalle.producto?.nombre || 'Producto no encontrado'}</p>
                            <p className="text-muted-foreground">{detalle.cantidad} x ${detalle.precioUnitario.toLocaleString()}</p>
                        </div>
                        <span className="font-semibold">${(detalle.cantidad * detalle.precioUnitario).toLocaleString()}</span>
                    </div>
                ))}
                {(!orden.detalles || orden.detalles.length === 0) && (
                    <p className="text-sm text-muted-foreground italic">Esta orden no tiene productos detallados.</p>
                )}
            </div>
        </div>

        <SheetFooter className="mt-8">
          <div className="flex w-full flex-col gap-2">
            
            <div className="flex w-full gap-2">
                <OrdenCompraFormModal orden={orden} modoEdicion={true} onSuccess={onSuccess}>
                  <Button variant="outline" className="w-full"><Edit className="h-4 w-4 mr-2" /> Editar</Button>
                </OrdenCompraFormModal>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full"><Trash2 className="h-4 w-4 mr-2" /> Eliminar</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro de eliminar esta orden?</AlertDialogTitle>
                      <AlertDialogDescription>Esta acción es permanente y no se puede deshacer.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Confirmar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </div><br /><hr /><br />

            <Button variant="outline" className="w-full" onClick={handleDownloadPdf}>
              <Download className="h-4 w-4 mr-2" /> Exportar a PDF
            </Button>

            <EmailFormModal orden={orden}>
                <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" /> Enviar por Correo
                </Button>
            </EmailFormModal>
            
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}