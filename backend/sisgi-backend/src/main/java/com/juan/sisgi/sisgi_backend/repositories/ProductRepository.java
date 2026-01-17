/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.juan.sisgi.sisgi_backend.repositories;

import com.juan.sisgi.sisgi_backend.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    @Query("SELECT p FROM Product p WHERE p.stock > 0 AND p.stock <= p.stockMinimo")
    List<Product> findLowStockProducts();

    // Cuenta productos agrupados por categoría (para la gráfica de torta)
    @Query("SELECT p.categoria, COUNT(p) FROM Product p GROUP BY p.categoria")
    List<Object[]> countProductosByCategoria();
    
    // Para actividad reciente
    List<Product> findTop5ByOrderByIdDesc();
}