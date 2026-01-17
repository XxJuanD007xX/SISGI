/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.juan.sisgi.sisgi_backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "detalle_orden_compra")
@Getter
@Setter
public class DetalleOrdenCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orden_compra_id")
    @JsonBackReference // Evita la recursión infinita al convertir a JSON
    private OrdenCompra ordenCompra;

    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Product producto;

    @Column(name = "cantidad")
    private int cantidad;

    @Column(name = "precio_unitario")
    private double precioUnitario; // Precio al momento de la compra
}
