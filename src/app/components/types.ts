// INTERFAZ PARA PROVEEDOR
export interface Product {
  id: number
  nombre: string
  descripcion?: string
  categoria: string
  precio: number
  stock: number
  stockMinimo?: number
  marca?: string
  codigoBarras?: string
  proveedor?: Proveedor
  ubicacion?: string
}

// INTERFAZ PARA PROVEEDOR
export interface Proveedor {
  id?: number;
  nombreEmpresa: string; 
  nitRuc?: string;        
  tipoProveedor?: string; 
  sitioWeb?: string;      
  personaContacto: string; 
  telefono: string;
  email: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  codigoPostal?: string;  
  condicionesPago?: string; 
  diasCredito?: number;     
  descuentoGeneral?: number; 
  notasObservaciones?: string; 
  estado?: string;
}

// INTERFAZ PARA EL DETALLE DE LA ORDEN 
export interface DetalleOrdenCompra {
  id?: number;
  producto: Product;
  cantidad: number;
  precioUnitario: number;
}

// INTERFAZ PARA ORDEN DE COMPRA
export interface OrdenCompra {
  id?: number;
  proveedor?: Proveedor;
  fechaOrden: string;  
  estado: string; 
  total: number;
  observaciones?: string; 
  detalles: DetalleOrdenCompra[];
}

// INTERFAZ PARA EL DETALLE DE LA VENTA
export interface DetalleVenta {
  id?: number;
  producto: Product;
  cantidad: number;
  precioUnitario: number;
}

// INTERFAZ PARA LA VENTA
export interface Venta {
  id?: number;
  fechaVenta: string;
  cliente?: string;
  total: number;
  estado?: string;
  motivoAnulacion?: string;
  detalles: DetalleVenta[];
}

// INTERFAZ PARA DRIVE
export interface Carpeta {
  id?: number;
  nombre: string;
  color?: string;
  autor?: string;
  fechaCreacion?: string;
  parentId?: number;
}

export interface Documento {
  id?: number;
  nombre: string;
  extension?: string;
  tipo: string; // file, video, image
  url?: string;
  size?: string;
  autor?: string;
  fechaCreacion?: string;
  carpetaId?: number;
}