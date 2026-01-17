package com.juan.sisgi.sisgi_backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "proveedores")
@Getter
@Setter
public class Proveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_empresa")
    private String nombreEmpresa;

    @Column(name = "nit_ruc")
    private String nitRuc;

    @Column(name = "tipo_proveedor")
    private String tipoProveedor;

    @Column(name = "sitio_web")
    private String sitioWeb;

    @Column(name = "persona_contacto")
    private String personaContacto;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "email")
    private String email;

    @Column(name = "direccion")
    private String direccion;

    @Column(name = "ciudad")
    private String ciudad;

    @Column(name = "pais")
    private String pais;

    @Column(name = "codigo_postal")
    private String codigoPostal;

    @Column(name = "condiciones_pago")
    private String condicionesPago;

    @Column(name = "dias_credito")
    private int diasCredito;

    @Column(name = "descuento_general")
    private double descuentoGeneral;

    @Column(name = "notas_observaciones")
    private String notasObservaciones;

    @Column(name = "estado")
    private String estado;

    @Column(name = "fecha_creacion", updatable = false, nullable = false)
    @CreationTimestamp
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @Column(name = "fecha_actualizacion", nullable = false)
    @UpdateTimestamp
    private LocalDateTime fechaActualizacion = LocalDateTime.now();
  
}