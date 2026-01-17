"use client"

import React, { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger } from "@/components/ui/sheet"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Trash2, Calendar, User, Package, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { Venta } from "./types"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface VentaDrawerProps {
  venta: Venta
  onSuccess?: () => void
}

export function VentaDrawer({ venta, onSuccess }: VentaDrawerProps) {
  const [motivo, setMotivo] = useState("Devolución de productos")

  const handleAnular = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/ventas/${venta.id}/anular`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motivo })
      })
      if (!response.ok) throw new Error("No se pudo anular la venta")
      toast.success("Venta anulada correctamente y stock restaurado.")
      if (onSuccess) onSuccess()
    } catch (error) {
       toast.error("Error al anular la venta.")
    }
  };

  const isAnulada = venta.estado === "ANULADA"

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">Ver Detalles</Button>
      </SheetTrigger>
      <SheetContent className="max-w-md w-full overflow-y-auto">
        <SheetHeader>
            <div className="flex items-center gap-3 mb-2">
                 <div className={`h-12 w-12 rounded-full ${isAnulada ? 'bg-destructive/20' : 'bg-primary/20'} flex items-center justify-center shadow-inner`}>
                    <DollarSign className={`h-7 w-7 ${isAnulada ? 'text-destructive' : 'text-primary'}`} />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <SheetTitle className="text-2xl font-bold">Venta #{venta.id}</SheetTitle>
                        {isAnulada && <Badge variant="destructive">ANULADA</Badge>}
                    </div>
                    <SheetDescription className="text-base">Detalles de la transacción</SheetDescription>
                </div>
            </div>
        </SheetHeader>
        <Separator className="my-4" />

        <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center">
                <span className="font-semibold text-muted-foreground flex items-center gap-2"><User className="h-4 w-4"/> Cliente</span>
                <span>{venta.cliente || "Consumidor Final"}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-semibold text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4"/> Fecha</span>
                <span>{new Date(venta.fechaVenta).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
             <div className="flex justify-between items-center">
                <span className="font-semibold text-muted-foreground">Total de la Venta</span>
                <span className={`font-bold text-lg ${isAnulada ? 'line-through text-muted-foreground' : ''}`}>
                    {venta.total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                </span>
            </div>
            {isAnulada && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg space-y-1">
                    <p className="font-semibold text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" /> Motivo de Anulación:
                    </p>
                    <p className="text-muted-foreground italic">"{venta.motivoAnulacion}"</p>
                </div>
            )}
        </div>

        <Separator className="my-4" />
        <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2"><Package className="h-4 w-4"/> Productos Vendidos</h4>
            <div className="pl-6 space-y-2 max-h-60 overflow-y-auto pr-2">
                {venta.detalles?.map(detalle => (
                    <div key={detalle.id} className="flex justify-between items-center text-sm">
                        <div>
                            <p className="font-medium">{detalle.producto?.nombre || 'Producto no encontrado'}</p>
                            <p className="text-muted-foreground">{detalle.cantidad} x ${detalle.precioUnitario.toLocaleString()}</p>
                        </div>
                        <span className={`font-semibold ${isAnulada ? 'line-through text-muted-foreground' : ''}`}>
                            ${(detalle.cantidad * detalle.precioUnitario).toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        </div>

        <SheetFooter className="mt-8">
          <div className="flex w-full flex-col gap-2">
            <Button variant="outline" className="w-full" disabled>
              Editar Venta (Próximamente)
            </Button>
            {!isAnulada && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full"><Trash2 className="h-4 w-4 mr-2" /> Anular Venta</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Anular esta venta?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se mantendrá el registro pero se marcará como ANULADA y los productos serán devueltos al stock.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-2 py-2">
                        <Label htmlFor="motivo">Motivo de la anulación</Label>
                        <Textarea
                            id="motivo"
                            placeholder="Ej: El cliente devolvió los productos por defecto..."
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                        />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleAnular} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Confirmar Anulación
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
