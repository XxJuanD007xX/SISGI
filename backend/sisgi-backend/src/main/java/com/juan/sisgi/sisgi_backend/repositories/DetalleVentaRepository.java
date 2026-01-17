package com.juan.sisgi.sisgi_backend.repositories;

import com.juan.sisgi.sisgi_backend.models.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Long> {
}