package com.juan.sisgi.sisgi_backend.dto;

import lombok.Data;

@Data
public class ProductDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private String categoria;
    private double precio;
    private int stock;
    private int stockMinimo;
    private String marca;
    private String codigoBarras;
    private String ubicacion;
    private ProveedorDTO proveedor;
}
