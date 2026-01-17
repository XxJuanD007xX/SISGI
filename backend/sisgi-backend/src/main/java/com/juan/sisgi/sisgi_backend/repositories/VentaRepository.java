package com.juan.sisgi.sisgi_backend.repositories;

import com.juan.sisgi.sisgi_backend.models.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {
    
    // Gráfica de línea (ya lo teníamos)
    @Query(value = "SELECT CAST(v.fecha_venta AS VARCHAR), SUM(v.total) FROM ventas v GROUP BY v.fecha_venta ORDER BY v.fecha_venta DESC LIMIT 7", nativeQuery = true)
    List<Object[]> findVentasUltimos7Dias();
    
    // Actividad reciente (ya lo teníamos)
    List<Venta> findTop5ByOrderByFechaVentaDesc();

    // --- NUEVO: Reporte por rango de fechas ---
    List<Venta> findByFechaVentaBetweenOrderByFechaVentaDesc(LocalDate inicio, LocalDate fin);
}