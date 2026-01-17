package com.juan.sisgi.sisgi_backend.dto;

import lombok.Data;

@Data
public class DetalleOrdenCompraDTO {
    private Long id;
    private ProductDTO producto;
    private int cantidad;
    private double precioUnitario;
}
