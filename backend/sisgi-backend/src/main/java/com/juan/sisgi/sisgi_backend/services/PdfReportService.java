package com.juan.sisgi.sisgi_backend.services;

import com.juan.sisgi.sisgi_backend.models.Configuracion;
import com.juan.sisgi.sisgi_backend.models.Product;
import com.juan.sisgi.sisgi_backend.models.Venta;
import com.juan.sisgi.sisgi_backend.repositories.ConfiguracionRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PdfReportService {

    @org.springframework.beans.factory.annotation.Autowired
    private ConfiguracionRepository configuracionRepository;

    // --- CONFIGURACIÓN DE ESTILO ---
    private final Color PRIMARY_COLOR = new Color(33, 37, 41); // Gris Oscuro (Casi negro)
    private final Color ACCENT_COLOR = new Color(220, 53, 69); // Rojo/Rosado (Tu color de acento)
    private final Color HEADER_BG_COLOR = new Color(240, 240, 240); // Gris muy claro para encabezados
    private final Color ZEBRA_STRIPE_COLOR = new Color(248, 249, 250); // Blanco humo para filas alternas
    
    private final float MARGIN = 40;
    private final float ROW_HEIGHT = 25;
    private final float FONT_SIZE_TITLE = 20;
    private final float FONT_SIZE_HEADER = 10;
    private final float FONT_SIZE_CELL = 10;

    // --- REPORTE DE INVENTARIO ---
    public ByteArrayInputStream generarReporteInventario(List<Product> productos) throws IOException {
        if (productos == null || productos.isEmpty()) return generarPdfVacio("Sin datos de inventario.");

        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);
            
            // Variables de control de flujo
            float yPosition = page.getMediaBox().getHeight() - MARGIN;
            int pageNum = 1;

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                // 1. Dibujar Título y Encabezado General
                yPosition = drawDocumentHeader(contentStream, "Valoración de Inventario", "Reporte General de Stock y Precios", yPosition);
                yPosition -= 20;

                // 2. Configuración de Columnas (Ancho y Título)
                // Total ancho usable ~ 530 puntos
                float[] colWidths = {40, 200, 100, 50, 70, 70}; 
                String[] headers = {"ID", "Producto", "Categoría", "Stock", "Precio", "Total"};
                
                // 3. Dibujar Encabezado de Tabla
                drawTableHeaders(contentStream, yPosition, colWidths, headers);
                yPosition -= ROW_HEIGHT;

                double valorTotalInventario = 0;
                int rowIndex = 0;

                for (Product p : productos) {
                    // Paginación
                    if (yPosition < MARGIN + 40) {
                        drawFooter(contentStream, pageNum);
                        contentStream.close(); // Cerrar página actual
                        
                        // Nueva página
                        PDPage newPage = new PDPage();
                        document.addPage(newPage);
                        PDPageContentStream newContentStream = new PDPageContentStream(document, newPage);
                        
                        yPosition = newPage.getMediaBox().getHeight() - MARGIN - 20;
                        drawTableHeaders(newContentStream, yPosition, colWidths, headers); // Repetir headers
                        yPosition -= ROW_HEIGHT;
                        pageNum++;
                        
                        // Truco: recursividad simulada reemplazando el stream en el loop (Java no permite reasignar la variable del try-with-resources fácilmente, así que cerramos y abrimos lógicamente)
                        // Para simplificar este ejemplo, asumimos que el try-with-resources maneja el stream principal, pero la paginación compleja requiere una estructura diferente.
                        // *NOTA*: Para producción robusta, la paginación debe refactorizarse. Aquí usaremos el stream original si no se llena, o cortamos (limitación de demo).
                        // -> Solución rápida: Break para evitar error, o usar lógica avanzada. 
                        // -> IMPLEMENTACIÓN ROBUSTA: Usaremos un solo bloque try para todo y gestionaremos streams manualmente.
                        return generarPdfConPaginacionInventario(productos); 
                    }

                    double valorItem = p.getStock() * p.getPrecio();
                    valorTotalInventario += valorItem;

                    // Dibujar Fila
                    boolean isOdd = (rowIndex % 2 != 0);
                    drawTableRow(contentStream, yPosition, colWidths, isOdd, 
                        String.valueOf(p.getId()),
                        safeText(p.getNombre()),
                        safeText(p.getCategoria()),
                        String.valueOf(p.getStock()),
                        String.format("$%,.0f", p.getPrecio()),
                        String.format("$%,.0f", valorItem)
                    );
                    yPosition -= ROW_HEIGHT;
                    rowIndex++;
                }

                // 4. Total Final
                yPosition -= 10;
                drawTotalBox(contentStream, yPosition, "Valor Total Inventario:", String.format("$%,.2f", valorTotalInventario));
                drawFooter(contentStream, pageNum);
            }
            
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.save(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            e.printStackTrace();
            return generarPdfVacio("Error: " + e.getMessage());
        }
    }

    // --- MÉTODO AUXILIAR PARA PAGINACIÓN DE INVENTARIO (Implementación Real) ---
    private ByteArrayInputStream generarPdfConPaginacionInventario(List<Product> productos) throws IOException {
        try (PDDocument document = new PDDocument()) {
            // Configuración inicial
            PDPage page = new PDPage();
            document.addPage(page);
            PDPageContentStream contentStream = new PDPageContentStream(document, page);
            
            float yPosition = page.getMediaBox().getHeight() - MARGIN;
            int pageNum = 1;
            
            // Título
            yPosition = drawDocumentHeader(contentStream, "Valoración de Inventario", "Reporte Completo", yPosition);
            yPosition -= 20;
            
            float[] colWidths = {40, 200, 100, 50, 70, 70}; 
            String[] headers = {"ID", "Producto", "Categoría", "Stock", "Precio", "Total"};
            
            drawTableHeaders(contentStream, yPosition, colWidths, headers);
            yPosition -= ROW_HEIGHT;

            double granTotal = 0;
            int index = 0;

            for (Product p : productos) {
                if (yPosition < MARGIN + 50) {
                    drawFooter(contentStream, pageNum);
                    contentStream.close();
                    
                    page = new PDPage();
                    document.addPage(page);
                    contentStream = new PDPageContentStream(document, page);
                    yPosition = page.getMediaBox().getHeight() - MARGIN - 40;
                    pageNum++;
                    
                    drawTableHeaders(contentStream, yPosition, colWidths, headers);
                    yPosition -= ROW_HEIGHT;
                }
                
                double total = p.getStock() * p.getPrecio();
                granTotal += total;
                
                drawTableRow(contentStream, yPosition, colWidths, (index++ % 2 != 0),
                    String.valueOf(p.getId()),
                    safeText(p.getNombre()),
                    safeText(p.getCategoria()),
                    String.valueOf(p.getStock()),
                    formatMoney(p.getPrecio()),
                    formatMoney(total)
                );
                yPosition -= ROW_HEIGHT;
            }
            
            drawTotalBox(contentStream, yPosition - 10, "VALOR TOTAL: ", formatMoney(granTotal));
            drawFooter(contentStream, pageNum);
            contentStream.close();

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.save(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    // --- REPORTE DE VENTAS (Con paginación) ---
    public ByteArrayInputStream generarReporteVentas(List<Venta> ventas, String inicio, String fin) throws IOException {
        if (ventas == null || ventas.isEmpty()) return generarPdfVacio("No hay ventas en este periodo.");

        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);
            PDPageContentStream contentStream = new PDPageContentStream(document, page);
            
            float yPosition = page.getMediaBox().getHeight() - MARGIN;
            int pageNum = 1;

            // Header
            yPosition = drawDocumentHeader(contentStream, "Reporte de Ventas", "Periodo: " + inicio + " al " + fin, yPosition);
            yPosition -= 20;

            // Config Tabla
            float[] colWidths = {40, 80, 200, 60, 100, 50}; // Ajustado
            // Nota: La suma debe ser aprox 530 (612 width - 2*40 margin)
            // Ajuste: 40+80+200+60+100 = 480. Sobran 50.
            // Reajuste: ID(40), Fecha(80), Cliente(200), Items(50), Total(100), Vacio(Resto)
            
            String[] headers = {"ID", "Fecha", "Cliente", "Items", "Total"};
            float[] realColWidths = {40, 90, 220, 60, 120}; // 530 Total

            drawTableHeaders(contentStream, yPosition, realColWidths, headers);
            yPosition -= ROW_HEIGHT;

            double granTotal = 0;
            int index = 0;

            for (Venta v : ventas) {
                if (yPosition < MARGIN + 50) {
                    drawFooter(contentStream, pageNum);
                    contentStream.close();
                    page = new PDPage();
                    document.addPage(page);
                    contentStream = new PDPageContentStream(document, page);
                    yPosition = page.getMediaBox().getHeight() - MARGIN - 40;
                    pageNum++;
                    drawTableHeaders(contentStream, yPosition, realColWidths, headers);
                    yPosition -= ROW_HEIGHT;
                }

                granTotal += v.getTotal();
                String fecha = v.getFechaVenta() != null ? v.getFechaVenta().toString() : "-";
                int items = v.getDetalles() != null ? v.getDetalles().size() : 0;

                drawTableRow(contentStream, yPosition, realColWidths, (index++ % 2 != 0),
                    String.valueOf(v.getId()),
                    fecha,
                    safeText(v.getCliente()),
                    String.valueOf(items),
                    formatMoney(v.getTotal())
                );
                yPosition -= ROW_HEIGHT;
            }

            drawTotalBox(contentStream, yPosition - 10, "TOTAL VENDIDO: ", formatMoney(granTotal));
            drawFooter(contentStream, pageNum);
            contentStream.close();

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.save(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
             e.printStackTrace();
             return generarPdfVacio("Error: " + e.getMessage());
        }
    }

    // ==========================================
    //      MÉTODOS DE DIBUJO (EL ARTE)
    // ==========================================

    private float drawDocumentHeader(PDPageContentStream cs, String title, String subtitle, float y) throws IOException {
        // Línea superior de color
        cs.setNonStrokingColor(PRIMARY_COLOR);
        cs.addRect(0, y - 5, 612, 5); // Barra superior full width
        cs.fill();
        
        y -= 35;
        
        // Título Principal
        cs.beginText();
        cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), FONT_SIZE_TITLE);
        cs.setNonStrokingColor(PRIMARY_COLOR);
        cs.newLineAtOffset(MARGIN, y);
        cs.showText(title);
        cs.endText();
        
        y -= 20;
        
        // Subtítulo / Fecha
        cs.beginText();
        cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
        cs.setNonStrokingColor(Color.GRAY);
        cs.newLineAtOffset(MARGIN, y);
        cs.showText(subtitle);
        cs.endText();
        
        // Fecha generación a la derecha
        String fechaGen = "Generado: " + LocalDate.now().toString();
        float textWidth = new PDType1Font(Standard14Fonts.FontName.HELVETICA).getStringWidth(fechaGen) / 1000 * 10;
        cs.beginText();
        cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
        cs.newLineAtOffset(612 - MARGIN - textWidth, y);
        cs.showText(fechaGen);
        cs.endText();

        return y - 10;
    }

    private void drawTableHeaders(PDPageContentStream cs, float y, float[] colWidths, String[] headers) throws IOException {
        float tableWidth = 0;
        for(float w : colWidths) tableWidth += w;
        
        // Fondo del encabezado
        cs.setNonStrokingColor(PRIMARY_COLOR);
        cs.addRect(MARGIN, y - 4, tableWidth, ROW_HEIGHT);
        cs.fill();

        // Texto del encabezado
        cs.setNonStrokingColor(Color.WHITE);
        cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), FONT_SIZE_HEADER);
        
        float x = MARGIN + 5; // Padding izquierdo
        for (int i = 0; i < headers.length; i++) {
            cs.beginText();
            cs.newLineAtOffset(x, y + 3);
            cs.showText(headers[i]);
            cs.endText();
            x += colWidths[i];
        }
        
        // Reset color a negro para lo siguiente
        cs.setNonStrokingColor(Color.BLACK);
    }

    private void drawTableRow(PDPageContentStream cs, float y, float[] colWidths, boolean isOdd, String... cells) throws IOException {
        float tableWidth = 0;
        for(float w : colWidths) tableWidth += w;

        // Fondo Zebra (Filas impares)
        if (isOdd) {
            cs.setNonStrokingColor(ZEBRA_STRIPE_COLOR);
            cs.addRect(MARGIN, y - 4, tableWidth, ROW_HEIGHT);
            cs.fill();
            cs.setNonStrokingColor(Color.BLACK); // Reset texto
        }

        // Borde inferior sutil
        cs.setStrokingColor(new Color(230, 230, 230));
        cs.moveTo(MARGIN, y - 4);
        cs.lineTo(MARGIN + tableWidth, y - 4);
        cs.stroke();

        cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), FONT_SIZE_CELL);
        
        float x = MARGIN + 5;
        for (int i = 0; i < cells.length; i++) {
            String text = cells[i];
            float colW = colWidths[i];
            
            // Alineación: Si es dinero o número (empieza con $ o es numérico), alinear a la derecha
            boolean isNumeric = text.startsWith("$") || text.matches("-?\\d+");
            
            if (isNumeric && i > 1) { // Evitar alinear ID a la derecha si no se quiere
                float textW = new PDType1Font(Standard14Fonts.FontName.HELVETICA).getStringWidth(text) / 1000 * FONT_SIZE_CELL;
                cs.beginText();
                // x + anchoColumna - paddingDerecho - anchoTexto
                cs.newLineAtOffset(x + colW - 15 - textW, y + 3); 
                cs.showText(text);
                cs.endText();
            } else {
                // Alineación Izquierda Normal
                // Truncar texto si es muy largo
                if (text.length() > 30) text = text.substring(0, 27) + "...";
                
                cs.beginText();
                cs.newLineAtOffset(x, y + 3);
                cs.showText(text);
                cs.endText();
            }
            x += colW;
        }
    }

    private void drawTotalBox(PDPageContentStream cs, float y, String label, String value) throws IOException {
        float width = 200;
        float xStart = 612 - MARGIN - width;
        
        // Fondo caja total
        cs.setNonStrokingColor(new Color(245, 245, 245));
        cs.addRect(xStart, y - 15, width, 30);
        cs.fill();
        
        // Borde rojo/accent a la izquierda
        cs.setNonStrokingColor(ACCENT_COLOR);
        cs.addRect(xStart, y - 15, 4, 30);
        cs.fill();
        
        // Texto Label
        cs.setNonStrokingColor(PRIMARY_COLOR);
        cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
        cs.beginText();
        cs.newLineAtOffset(xStart + 15, y - 5);
        cs.showText(label);
        cs.endText();
        
        // Texto Valor (Derecha)
        float valWidth = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD).getStringWidth(value) / 1000 * 14;
        cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 14);
        cs.beginText();
        cs.newLineAtOffset(xStart + width - valWidth - 10, y - 6);
        cs.showText(value);
        cs.endText();
    }

    private void drawFooter(PDPageContentStream cs, int pageNum) throws IOException {
        cs.setNonStrokingColor(Color.GRAY);
        cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 9);
        
        Configuracion config = configuracionRepository.findFirstByOrderByIdAsc().orElse(new Configuracion());
        String empresa = config.getNombreEmpresa() != null ? config.getNombreEmpresa() : "Variedades Dipal";

        String footerText = "SISGI | " + empresa + " | Página " + pageNum;
        float textWidth = new PDType1Font(Standard14Fonts.FontName.HELVETICA).getStringWidth(footerText) / 1000 * 9;
        
        cs.beginText();
        cs.newLineAtOffset((612 - textWidth) / 2, 30); // Centrado
        cs.showText(footerText);
        cs.endText();
    }

    // --- HELPERS ---
    private ByteArrayInputStream generarPdfVacio(String mensaje) {
        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage();
            doc.addPage(page);
            PDPageContentStream cs = new PDPageContentStream(doc, page);
            cs.beginText();
            cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
            cs.newLineAtOffset(50, 700);
            cs.showText(mensaje);
            cs.endText();
            cs.close();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            doc.save(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) { return new ByteArrayInputStream(new byte[0]); }
    }

    private String safeText(String text) {
        if (text == null) return "-";
        return text.replace("\n", " ").replace("\r", "").replace("\t", " ").trim();
    }
    
    private String formatMoney(double amount) {
        return String.format("$%,.0f", amount);
    }
}