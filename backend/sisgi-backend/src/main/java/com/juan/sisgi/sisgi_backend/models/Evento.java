package com.juan.sisgi.sisgi_backend.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "eventos")
@Data
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    private String descripcion;

    @Column(nullable = false)
    private LocalDate fecha;

    private String horaInicio;

    private String horaFin;

    private String tipo; // reunion, entrega, pago, otro

    private String color;

    private String textColor;
}
