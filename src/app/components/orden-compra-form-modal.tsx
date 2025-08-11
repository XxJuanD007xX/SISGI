"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator";
import { Plus, ShoppingCart, DollarSign, Calendar, FileText, Trash2, Building, PackageSearch } from "lucide-react"
import { toast } from "sonner"
import { OrdenCompra, Proveedor, Product, DetalleOrdenCompra } from "./types"

interface OrdenFormModalProps {
  orden?: OrdenCompra
  modoEdicion?: boolean
  onSuccess?: () => void
  children: React.ReactNode
}

export function OrdenCompraFormModal({ orden, modoEdicion = false, onSuccess, children }: OrdenFormModalProps) {

  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [listaProveedores, setListaProveedores] = useState<Proveedor[]>([])
  const [listaProductos, setListaProductos] = useState<Product[]>([])

  const [productoSeleccionado, setProductoSeleccionado] = useState<Product | null>(null);
  const [cantidadProducto, setCantidadProducto] = useState(1);

  const initialState: Partial<OrdenCompra> = {
    proveedor: undefined,
    fechaOrden: new Date().toISOString().split('T')[0], // Fecha de hoy por defecto
    estado: "Pendiente",
    total: 0,
    observaciones: "",
    detalles: [],
  }

  const [formData, setFormData] = useState(initialState)

  // Cargar proveedores y datos de la orden si está en modo edición
  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          // Cargar proveedores
          const provRes = await fetch("http://localhost:8080/api/proveedores");
          if (provRes.ok) setListaProveedores(await provRes.json());

          // Cargar productos
          const prodRes = await fetch("http://localhost:8080/api/products");
          if (prodRes.ok) setListaProductos(await prodRes.json());
          
        } catch (error) {
          toast.error("No se pudo cargar la información inicial.");
        }
      }
      fetchData();

      if (modoEdicion && orden) {
        setFormData(orden);
      } else {
        setFormData(initialState);
      }
    }
  }, [open, modoEdicion, orden])

  // Recalcular el total cada vez que los detalles cambian
  useEffect(() => {
    const nuevoTotal = formData.detalles?.reduce((acc, detalle) => acc + (detalle.precioUnitario * detalle.cantidad), 0) ?? 0;
    setFormData(prev => ({ ...prev, total: nuevoTotal }));
  }, [formData.detalles]);

  const handleAddProducto = () => {
    if (!productoSeleccionado || cantidadProducto <= 0) {
      toast.warning("Selecciona un producto y una cantidad válida.");
      return;
    }

    const nuevoDetalle: DetalleOrdenCompra = {
      producto: productoSeleccionado,
      cantidad: cantidadProducto,
      precioUnitario: productoSeleccionado.precio, // Usamos el precio actual del producto
    };

    setFormData(prev => ({
      ...prev,
      detalles: [...(prev.detalles || []), nuevoDetalle]
    }));

    // Resetear campos para el siguiente producto
    setProductoSeleccionado(null);
    setCantidadProducto(1);
  };
  
  const handleRemoveProducto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      detalles: prev.detalles?.filter((_, i) => i !== index)
    }));
  };

 // --- MANEJADORES DE CAMBIOS EN EL FORMULARIO ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: keyof OrdenCompra, value: string) => {
      if (field === 'proveedor') {
          const proveedorSeleccionado = listaProveedores.find(p => p.id === Number(value));
          setFormData(prev => ({ ...prev, proveedor: proveedorSeleccionado }));
      } else {
          setFormData(prev => ({ ...prev, [field]: value }));
      }
  };

  // --- LÓGICA DE ENVÍO ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Aquí preparamos el cuerpo (body) para la API
    const bodyPayload = {
        ...formData,
        proveedor: { id: formData.proveedor?.id }, // Solo enviamos el ID del proveedor
        detalles: formData.detalles?.map(d => ({
            producto: { id: d.producto.id }, // Solo el ID del producto
            cantidad: d.cantidad,
            precioUnitario: d.precioUnitario
        }))
    };

    const url = modoEdicion ? `http://localhost:8080/api/ordenes/${orden?.id}` : "http://localhost:8080/api/ordenes"
    const method = modoEdicion ? "PUT" : "POST"

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      if (!response.ok) throw new Error(`Error al ${modoEdicion ? "actualizar" : "crear"} la orden`);
      
      toast.success(`Orden ${modoEdicion ? "actualizada" : "creada"} con éxito`);
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(`Error al ${modoEdicion ? "actualizar" : "crear"} la orden: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }

  const isFormValid = formData.proveedor && formData.fechaOrden && formData.detalles && formData.detalles.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">

        <DialogHeader className="relative mb-2">
            <div className="flex items-center gap-4 p-4 rounded-t-lg bg-gradient-to-r from-primary/10 via-background to-background border-b">
                <div className="flex items-center justify-center rounded-full bg-primary/20 h-12 w-12 shadow-inner">
                    <ShoppingCart className="h-7 w-7" />
                </div>
                <div>
                    <DialogTitle className="text-2xl font-extrabold tracking-tight">{modoEdicion ? "Editar Orden de Compra" : "Nueva Orden de Compra"}</DialogTitle>
                    <DialogDescription className="text-muted-foreground mt-1 text-base">Completa los detalles del pedido al proveedor.</DialogDescription>
                </div>
            </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Columna Izquierda: Datos generales */}
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/50 p-4 space-y-4">
                <h3 className="font-medium flex items-center gap-2"><FileText className="h-4 w-4 text-primary"/>Proveedor</h3>
                <Select value={formData.proveedor?.id?.toString()} onValueChange={(value) => handleSelectChange("proveedor", value)}>
                    <SelectTrigger><SelectValue placeholder="Selecciona un proveedor" /></SelectTrigger>
                    <SelectContent>
                        {listaProveedores.map((p) => <SelectItem key={p.id} value={p.id!.toString()}>{p.nombreEmpresa}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
              <div className="rounded-lg border bg-muted/50 p-4 grid grid-cols-2 gap-4">
                  <div>
                      <Label htmlFor="fechaOrden">Fecha de Orden *</Label>
                      <Input id="fechaOrden" type="date" value={formData.fechaOrden} onChange={handleInputChange} required />
                  </div>
                  <div>
                      <Label htmlFor="estado">Estado *</Label>
                      <Select value={formData.estado} onValueChange={(value) => handleSelectChange("estado", value)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Pendiente">Pendiente</SelectItem>
                              <SelectItem value="Recibido">Recibido</SelectItem>
                              <SelectItem value="Cancelado">Cancelado</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
              </div>
               <div className="rounded-lg border bg-muted/50 p-4">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea id="observaciones" placeholder="Añade notas o detalles..." value={formData.observaciones || ''} onChange={handleInputChange} />
              </div> 
            </div>

            {/* Columna Derecha: Detalles de productos */}
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/50 p-4 space-y-4">
                  <h3 className="font-medium flex items-center gap-2"><PackageSearch className="h-4 w-4 text-primary" /> Agregar Productos</h3>
                  <div className="flex gap-2 items-end">
                      <div className="flex-1">
                          <Label>Producto</Label>
                          <Select onValueChange={(value) => setProductoSeleccionado(listaProductos.find(p => p.id === Number(value)) || null)}>
                              <SelectTrigger><SelectValue placeholder="Busca un producto..." /></SelectTrigger>
                              <SelectContent>
                                  {listaProductos.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.nombre}</SelectItem>)}
                              </SelectContent>
                          </Select>
                      </div>
                      <div className="w-24">
                          <Label>Cantidad</Label>
                          <Input type="number" value={cantidadProducto} onChange={(e) => setCantidadProducto(Number(e.target.value))} min="1" />
                      </div>
                      <Button type="button" onClick={handleAddProducto}><Plus className="h-4 w-4" /></Button>
                  </div>
              </div>
              <div className="rounded-lg border bg-muted/50 p-4">
                <h3 className="font-medium mb-2">Detalles del Pedido ({formData.detalles?.length || 0})</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {formData.detalles?.map((detalle, index) => (
                        <div key={index} className="flex justify-between items-center text-sm p-2 bg-background rounded">
                            <div>
                                <p className="font-medium">{detalle.producto.nombre}</p>
                                <p className="text-muted-foreground">{detalle.cantidad} x ${detalle.precioUnitario.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">${(detalle.cantidad * detalle.precioUnitario).toLocaleString()}</span>
                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveProducto(index)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {(!formData.detalles || formData.detalles.length === 0) && (
                        <p className="text-sm text-muted-foreground text-center py-4">Aún no has agregado productos.</p>
                    )}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${formData.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Cancelar</Button>
              <Button type="submit" disabled={!isFormValid || isLoading}>{isLoading ? "Guardando..." : "Guardar Orden"}</Button>
          </DialogFooter>

        </form>

      </DialogContent>
    </Dialog>
  )
}