package com.juan.sisgi.sisgi_backend.controllers;

import com.juan.sisgi.sisgi_backend.services.ReporteService;
import com.juan.sisgi.sisgi_backend.models.Venta;
import com.juan.sisgi.sisgi_backend.models.Product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "http://localhost:3000")
public class ReporteController {

    @Autowired
    private ReporteService reporteService;

    // --- Dashboard ---
    @GetMapping("/dashboard-stats")
    public Map<String, Object> getDashboardStats() {
        return reporteService.getDashboardStats();
    }

    // --- NUEVO: Estadísticas de Proveedores (¡El endpoint que faltaba!) ---
    @GetMapping("/proveedores-stats")
    public Map<String, Object> getProveedoresStats() {
        return reporteService.getProveedoresStats();
    }

    // --- Gráficos ---
    @GetMapping("/ventas-historico")
    public List<Map<String, Object>> getVentasHistorico() {
        return reporteService.getVentasHistorico();
    }

    @GetMapping("/categorias-distribucion")
    public List<Map<String, Object>> getCategoriasDistribucion() {
        return reporteService.getDistribucionCategorias();
    }

    @GetMapping("/actividad-reciente")
    public List<Map<String, Object>> getActividadReciente() {
        return reporteService.getActividadReciente();
    }

    // --- Tablas JSON ---
    @GetMapping("/ventas")
    public List<Venta> getReporteVentasJson(
            @RequestParam("inicio") String inicio, 
            @RequestParam("fin") String fin) {
        return reporteService.getReporteVentasData(LocalDate.parse(inicio), LocalDate.parse(fin));
    }

    @GetMapping("/inventario")
    public List<Product> getReporteInventarioJson() {
        return reporteService.getReporteInventarioData();
    }

    // --- Descarga PDFs ---
    @GetMapping(value = "/ventas/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<InputStreamResource> descargarPdfVentas(
            @RequestParam("inicio") String inicio, 
            @RequestParam("fin") String fin) throws IOException {
        
        ByteArrayInputStream bis = reporteService.generarPdfVentas(LocalDate.parse(inicio), LocalDate.parse(fin));
        
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=reporte_ventas.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }

    @GetMapping(value = "/inventario/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<InputStreamResource> descargarPdfInventario() throws IOException {
        
        ByteArrayInputStream bis = reporteService.generarPdfInventario();
        
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=reporte_inventario.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }
}