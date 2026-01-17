package com.juan.sisgi.sisgi_backend.repositories;

import com.juan.sisgi.sisgi_backend.models.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio para la entidad Proveedor.
 * Extiende de JpaRepository, lo que le da acceso a métodos CRUD estándar.
 * Spring Data JPA implementará automáticamente esta interfaz en tiempo de ejecución.
 * * @param <Proveedor> La entidad que manejará.
 * @param <Integer> El tipo de dato de la llave primaria (ID) de la entidad Proveedor.
 */
@Repository
public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {
    
    // --- NUEVO MÉTODO AÑADIDO ---
    /**
     * Cuenta el número de proveedores que tienen un estado específico.
     * @param estado El estado a buscar (ej: "Activo", "Inactivo").
     * @return El número de proveedores con ese estado.
     */
    long countByEstado(String estado);
}