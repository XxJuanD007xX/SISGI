package com.juan.sisgi.sisgi_backend.services;

import com.juan.sisgi.sisgi_backend.models.Configuracion;
import com.juan.sisgi.sisgi_backend.models.DetalleOrdenCompra;
import com.juan.sisgi.sisgi_backend.models.OrdenCompra;
import com.juan.sisgi.sisgi_backend.models.Proveedor;
import com.juan.sisgi.sisgi_backend.repositories.ConfiguracionRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
public class PdfService {

    @Autowired
    private ConfiguracionRepository configuracionRepository;

    private static final Color COLOR_PRIMARY = new Color(30, 41, 59); // Slate 800
    private static final Color COLOR_ACCENT = new Color(37, 99, 235); // Blue 600
    private static final Color COLOR_BORDER = new Color(226, 232, 240); // Slate 200
    private static final Color COLOR_BG_HEADER = new Color(248, 250, 252); // Slate 50

    private static final PDType1Font FONT_BOLD = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
    private static final PDType1Font FONT_NORMAL = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
    private static final float MARGIN = 50;

    public ByteArrayInputStream generarPdfDeOrden(OrdenCompra orden) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            Configuracion config = configuracionRepository.findFirstByOrderByIdAsc().orElse(new Configuracion());

            try (PDPageContentStream cs = new PDPageContentStream(document, page)) {
                float y = page.getMediaBox().getHeight() - MARGIN;

                // --- ENCABEZADO ---
                drawHeader(cs, page, y, config, orden.getId());
                y -= 100;

                // --- INFO EMPRESA Y PROVEEDOR ---
                drawAddresses(cs, y, config, orden.getProveedor(), orden.getFechaOrden());
                y -= 120;

                // --- TABLA DE PRODUCTOS ---
                y = drawItemsTable(cs, page, y, orden);
                
                // --- TOTALES Y OBSERVACIONES ---
                drawTotals(cs, page, y, orden);

                // --- PIE DE PÁGINA ---
                drawFooter(cs, page, config);
            }
            document.save(out);
        }
        return new ByteArrayInputStream(out.toByteArray());
    }

    private void drawHeader(PDPageContentStream cs, PDPage page, float y, Configuracion config, Long ordenId) throws IOException {
        String empresa = config.getNombreEmpresa() != null ? config.getNombreEmpresa() : "SISGI - Gestión de Inventarios";
        
        // Logo Placeholder o Texto
        cs.setNonStrokingColor(COLOR_ACCENT);
        cs.addRect(MARGIN, y - 5, 40, 40);
        cs.fill();
        
        writeText(cs, FONT_BOLD, 20, MARGIN + 50, y + 20, empresa.toUpperCase());
        writeText(cs, FONT_NORMAL, 10, MARGIN + 50, y + 5, "Orden de Compra Oficial");

        // Info de la Orden a la Derecha
        float rightAlignX = page.getMediaBox().getWidth() - MARGIN;
        cs.setNonStrokingColor(COLOR_PRIMARY);
        writeTextRight(cs, FONT_BOLD, 14, rightAlignX, y + 20, "ORDEN # " + String.format("%05d", ordenId));
        writeTextRight(cs, FONT_NORMAL, 10, rightAlignX, y + 5, "Original");
        
        cs.setStrokingColor(COLOR_BORDER);
        cs.setLineWidth(1);
        cs.moveTo(MARGIN, y - 20);
        cs.lineTo(rightAlignX, y - 20);
        cs.stroke();
    }

    private void drawAddresses(PDPageContentStream cs, float y, Configuracion config, Proveedor prov, LocalDate fecha) throws IOException {
        float colWidth = 240;
        
        // Columna Izquierda: Proveedor
        writeText(cs, FONT_BOLD, 9, MARGIN, y, "DATOS DEL PROVEEDOR");
        y -= 20;
        writeText(cs, FONT_BOLD, 11, MARGIN, y, prov.getNombreEmpresa());
        y -= 15;
        writeText(cs, FONT_NORMAL, 9, MARGIN, y, "NIT: " + prov.getNitRuc());
        y -= 15;
        writeText(cs, FONT_NORMAL, 9, MARGIN, y, "Contacto: " + prov.getPersonaContacto());
        y -= 15;
        writeText(cs, FONT_NORMAL, 9, MARGIN, y, "Email: " + prov.getEmail());

        // Columna Derecha: Empresa (Destino)
        float x2 = MARGIN + 300;
        float y2 = y + 65;
        writeText(cs, FONT_BOLD, 9, x2, y2, "ENVIAR A / FACTURAR A");
        y2 -= 20;
        writeText(cs, FONT_BOLD, 11, x2, y2, config.getNombreEmpresa() != null ? config.getNombreEmpresa() : "Variedades Dipal");
        y2 -= 15;
        writeText(cs, FONT_NORMAL, 9, x2, y2, "NIT: " + (config.getNit() != null ? config.getNit() : "N/A"));
        y2 -= 15;
        writeText(cs, FONT_NORMAL, 9, x2, y2, config.getDireccion() != null ? config.getDireccion() : "Dirección no configurada");
        y2 -= 15;
        writeText(cs, FONT_NORMAL, 9, x2, y2, "Fecha: " + fecha.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
    }

    private float drawItemsTable(PDPageContentStream cs, PDPage page, float y, OrdenCompra orden) throws IOException {
        float[] colWidths = {250, 60, 90, 100};
        String[] headers = {"Descripción del Producto", "Cant.", "P. Unitario", "Subtotal"};

        // Encabezado Tabla
        cs.setNonStrokingColor(COLOR_BG_HEADER);
        cs.addRect(MARGIN, y - 10, page.getMediaBox().getWidth() - 2 * MARGIN, 25);
        cs.fill();
        
        cs.setStrokingColor(COLOR_BORDER);
        cs.addRect(MARGIN, y - 10, page.getMediaBox().getWidth() - 2 * MARGIN, 25);
        cs.stroke();

        float x = MARGIN + 10;
        cs.setNonStrokingColor(COLOR_PRIMARY);
        for (int i = 0; i < headers.length; i++) {
            writeText(cs, FONT_BOLD, 9, x, y, headers[i]);
            x += colWidths[i];
        }

        y -= 35;
        NumberFormat nf = NumberFormat.getCurrencyInstance(new Locale("es", "CO"));

        for (DetalleOrdenCompra d : orden.getDetalles()) {
            cs.setNonStrokingColor(Color.BLACK);
            writeText(cs, FONT_NORMAL, 9, MARGIN + 10, y, d.getProducto().getNombre());
            writeText(cs, FONT_NORMAL, 9, MARGIN + colWidths[0] + 10, y, String.valueOf(d.getCantidad()));
            writeText(cs, FONT_NORMAL, 9, MARGIN + colWidths[0] + colWidths[1] + 10, y, nf.format(d.getPrecioUnitario()));
            writeText(cs, FONT_BOLD, 9, MARGIN + colWidths[0] + colWidths[1] + colWidths[2] + 10, y, nf.format(d.getCantidad() * d.getPrecioUnitario()));

            cs.setStrokingColor(COLOR_BORDER);
            cs.moveTo(MARGIN, y - 8);
            cs.lineTo(page.getMediaBox().getWidth() - MARGIN, y - 8);
            cs.stroke();

            y -= 25;
        }

        return y;
    }

    private void drawTotals(PDPageContentStream cs, PDPage page, float y, OrdenCompra orden) throws IOException {
        NumberFormat nf = NumberFormat.getCurrencyInstance(new Locale("es", "CO"));
        float rightX = page.getMediaBox().getWidth() - MARGIN;
        float labelX = rightX - 150;

        y -= 10;
        writeText(cs, FONT_BOLD, 9, MARGIN, y, "OBSERVACIONES:");
        writeText(cs, FONT_NORMAL, 9, MARGIN, y - 15, orden.getObservaciones() != null ? orden.getObservaciones() : "Sin observaciones adicionales.");

        writeText(cs, FONT_NORMAL, 10, labelX, y, "SUBTOTAL:");
        writeTextRight(cs, FONT_NORMAL, 10, rightX, y, nf.format(orden.getTotal()));
        
        y -= 20;
        cs.setNonStrokingColor(COLOR_BG_HEADER);
        cs.addRect(labelX - 10, y - 10, 160, 30);
        cs.fill();
        cs.setStrokingColor(COLOR_ACCENT);
        cs.addRect(labelX - 10, y - 10, 160, 30);
        cs.stroke();

        cs.setNonStrokingColor(COLOR_ACCENT);
        writeText(cs, FONT_BOLD, 12, labelX, y, "TOTAL NETO:");
        writeTextRight(cs, FONT_BOLD, 12, rightX, y, nf.format(orden.getTotal()));
    }

    private void drawFooter(PDPageContentStream cs, PDPage page, Configuracion config) throws IOException {
        float y = 40;
        cs.setNonStrokingColor(Color.GRAY);
        String text = "Este documento es una representación oficial de " + (config.getNombreEmpresa() != null ? config.getNombreEmpresa() : "SISGI") + ".";
        float width = FONT_NORMAL.getStringWidth(text) / 1000 * 8;
        writeText(cs, FONT_NORMAL, 8, (page.getMediaBox().getWidth() - width) / 2, y, text);

        String pageInfo = "Generado por SISGI v2.5 | " + LocalDate.now().getYear();
        float width2 = FONT_NORMAL.getStringWidth(pageInfo) / 1000 * 7;
        writeText(cs, FONT_NORMAL, 7, (page.getMediaBox().getWidth() - width2) / 2, y - 12, pageInfo);
    }

    private void writeText(PDPageContentStream cs, PDType1Font font, float size, float x, float y, String text) throws IOException {
        cs.beginText();
        cs.setFont(font, size);
        cs.newLineAtOffset(x, y);
        cs.showText(text != null ? text : "");
        cs.endText();
    }

    private void writeTextRight(PDPageContentStream cs, PDType1Font font, float size, float x, float y, String text) throws IOException {
        float width = font.getStringWidth(text != null ? text : "") / 1000 * size;
        writeText(cs, font, size, x - width, y, text);
    }
}
