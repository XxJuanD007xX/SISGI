/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.juan.sisgi.sisgi_backend.repositories;

import com.juan.sisgi.sisgi_backend.models.OrdenCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio para la entidad OrdenCompra.
 * Extiende de JpaRepository para obtener automáticamente los métodos CRUD.
 */
@Repository
public interface OrdenCompraRepository extends JpaRepository<OrdenCompra, Long> {
    //Método para contar órdenes según su estado
    long countByEstado(String estado);
}