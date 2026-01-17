package com.juan.sisgi.sisgi_backend.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "configuracion")
@Data
public class Configuracion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombreEmpresa;
    private String nit;
    private String direccion;
    private String telefono;
    private String email;
    private String sitioWeb;
    private String moneda = "COP";

    @Lob
    private String logoBase64;
}
