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
  proveedor?: string
  ubicacion?: string
}

// NUEVA INTERFAZ PARA PROVEEDOR
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