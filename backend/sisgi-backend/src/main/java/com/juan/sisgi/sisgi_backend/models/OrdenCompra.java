/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.juan.sisgi.sisgi_backend.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter; // <-- ASEGÚRATE DE IMPORTAR ESTO
import lombok.Setter; // <-- ASEGÚRATE DE IMPORTAR ESTO
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;
/**
 * Entidad que representa una Orden de Compra en la base de datos.
 * Esta tabla estará relacionada con un Proveedor.
 */
@Entity
@Table(name = "ordenes_compra")
@Getter // <-- USA ESTAS
@Setter // <-- DOS ANOTACIONES
public class OrdenCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con la entidad Proveedor.
    // Muchos 'OrdenCompra' pueden pertenecer a un 'Proveedor'.
    @ManyToOne
    @JoinColumn(name = "proveedor_id", nullable = false)
    private Proveedor proveedor;

    @Column(name = "fecha_orden")
    private LocalDate fechaOrden;

    @Column(name = "estado") // Ej: "Pendiente", "Recibido", "Cancelado"
    private String estado;

    @Column(name = "total")
    private double total;

    // En un sistema más complejo, aquí habría una lista de 'DetalleOrden'
    // que contendría los productos. Para simplicidad, lo omitimos por ahora.
    @Column(name = "observaciones")
    private String observaciones;
    
    @OneToMany(mappedBy = "ordenCompra", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // El otro lado de la relación para evitar recursión
    private List<DetalleOrdenCompra> detalles = new ArrayList<>();
    
}