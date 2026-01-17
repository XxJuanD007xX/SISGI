/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.juan.sisgi.sisgi_backend.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "anuncios")
@Data
public class Anuncio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500) // Limite tipo Twitter
    private String contenido;

    @Column(nullable = false)
    private String autorNombre;

    @Column(nullable = false)
    private String autorId; // ID del usuario de Clerk

    @Column(nullable = false)
    private String autorRol; // "Administrador", "Agente", "Usuario"

    private LocalDateTime fechaCreacion = LocalDateTime.now();

    private boolean fijado = false; // Solo admins

    @ElementCollection
    private List<String> reacciones = new ArrayList<>(); // Lista de IDs de usuarios que dieron like

    // Método auxiliar para contar likes
    public int getLikesCount() {
        return reacciones.size();
    }
}