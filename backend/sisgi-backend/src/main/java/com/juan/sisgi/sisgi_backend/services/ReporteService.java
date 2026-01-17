package com.juan.sisgi.sisgi_backend.services;

import com.juan.sisgi.sisgi_backend.models.Product;
import com.juan.sisgi.sisgi_backend.models.Venta;
import com.juan.sisgi.sisgi_backend.repositories.ProductRepository;
import com.juan.sisgi.sisgi_backend.repositories.ProveedorRepository;
import com.juan.sisgi.sisgi_backend.repositories.OrdenCompraRepository;
import com.juan.sisgi.sisgi_backend.repositories.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReporteService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProveedorRepository proveedorRepository;
    @Autowired
    private OrdenCompraRepository ordenCompraRepository;
    @Autowired
    private VentaRepository ventaRepository;
    @Autowired
    private PdfReportService pdfReportService;
   
    // --- DASHBOARD PRINCIPAL ---
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalProductos = productRepository.count();
        long totalProveedores = proveedorRepository.count();
        long ordenesPendientes = ordenCompraRepository.countByEstado("Pendiente");
        
        double valorInventario = productRepository.findAll().stream()
                .mapToDouble(p -> p.getStock() * p.getPrecio())
                .sum();
        
        int stockBajo = productRepository.findLowStockProducts().size();

        stats.put("totalProductos", totalProductos);
        stats.put("valorInventario", valorInventario);
        stats.put("totalProveedores", totalProveedores);
        stats.put("ordenesPendientes", ordenesPendientes);
        stats.put("stockBajo", stockBajo);

        return stats;
    }

    // --- NUEVO: ESTADÍSTICAS PARA MÓDULO PROVEEDORES ---
    public Map<String, Object> getProveedoresStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long total = proveedorRepository.count();
        // Usamos el nuevo método del repositorio (asegúrate de que el estado se guarde como "Activo" en BD)
        long activos = proveedorRepository.countByEstado("Activo"); 
        long pendientes = ordenCompraRepository.countByEstado("Pendiente");

        stats.put("totalProveedores", total);
        stats.put("proveedoresActivos", activos);
        stats.put("ordenesPendientes", pendientes);
        
        return stats;
    }

    // --- DATOS PARA GRÁFICAS ---
    public List<Map<String, Object>> getVentasHistorico() {
        List<Object[]> resultados = ventaRepository.findVentasUltimos7Dias();
        List<Map<String, Object>> historico = new ArrayList<>();
        for (Object[] fila : resultados) {
            Map<String, Object> dato = new HashMap<>();
            dato.put("fecha", fila[0]);
            dato.put("total", fila[1]);
            historico.add(dato);
        }
        Collections.reverse(historico); 
        return historico;
    }

    public List<Map<String, Object>> getDistribucionCategorias() {
        List<Object[]> resultados = productRepository.countProductosByCategoria();
        List<Map<String, Object>> distribucion = new ArrayList<>();
        for (Object[] fila : resultados) {
            Map<String, Object> dato = new HashMap<>();
            dato.put("name", fila[0]);
            dato.put("value", fila[1]);
            distribucion.add(dato);
        }
        return distribucion;
    }

    public List<Map<String, Object>> getActividadReciente() {
        List<Map<String, Object>> actividad = new ArrayList<>();
        List<Product> productos = productRepository.findTop5ByOrderByIdDesc();
        for (Product p : productos) {
            Map<String, Object> item = new HashMap<>();
            item.put("tipo", "producto");
            item.put("mensaje", "Nuevo producto: " + p.getNombre());
            item.put("fecha", "Reciente"); 
            item.put("id", "p-" + p.getId());
            actividad.add(item);
        }
        List<Venta> ventas = ventaRepository.findTop5ByOrderByFechaVentaDesc();
        for (Venta v : ventas) {
            Map<String, Object> item = new HashMap<>();
            item.put("tipo", "venta");
            item.put("mensaje", "Venta por $" + String.format("%,.0f", v.getTotal()));
            item.put("fecha", v.getFechaVenta().toString());
            item.put("id", "v-" + v.getId());
            actividad.add(item);
        }
        Collections.shuffle(actividad);
        return actividad.stream().limit(6).collect(Collectors.toList());
    }
    
    // --- DATOS PARA TABLAS ---
    public List<Product> getReporteInventarioData() {
        return productRepository.findAll();
    }

    public List<Venta> getReporteVentasData(LocalDate inicio, LocalDate fin) {
        return ventaRepository.findByFechaVentaBetweenOrderByFechaVentaDesc(inicio, fin);
    }

    // --- GENERACIÓN PDF ---
    public ByteArrayInputStream generarPdfInventario() throws IOException {
        return pdfReportService.generarReporteInventario(productRepository.findAll());
    }

    public ByteArrayInputStream generarPdfVentas(LocalDate inicio, LocalDate fin) throws IOException {
        return pdfReportService.generarReporteVentas(
            ventaRepository.findByFechaVentaBetweenOrderByFechaVentaDesc(inicio, fin), 
            inicio.toString(), 
            fin.toString()
        );
    }
}