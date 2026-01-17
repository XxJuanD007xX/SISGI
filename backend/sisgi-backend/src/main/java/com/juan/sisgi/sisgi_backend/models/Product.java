package com.juan.sisgi.sisgi_backend.models;

import jakarta.persistence.*;
import lombok.Data; // Importamos @Data de nuevo

@Entity
@Data // Volvemos a usar @Data para simplicidad por ahora
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String descripcion;
    private String categoria;
    private double precio; // <-- Volvemos al campo 'precio' original
    private int stock;
    private int stockMinimo;
    private String marca;
    private String codigoBarras;
    private String ubicacion;
    @ManyToOne
    @JoinColumn(name = "proveedor_id")
    private Proveedor proveedor;
}