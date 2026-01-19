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
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.Locale;

@Service
public class PdfService {

    @Autowired
    private ConfiguracionRepository configuracionRepository;

    private static final Color COLOR_PRIMARY = new Color(15, 23, 42); // Slate 900
    private static final Color COLOR_SECONDARY = new Color(71, 85, 105); // Slate 600
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
                drawHeader(document, cs, page, y, config, orden.getId());
                y -= 100;

                // --- INFO EMPRESA Y PROVEEDOR ---
                drawAddresses(cs, y, config, orden.getProveedor(), orden.getFechaOrden());
                y -= 130;

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

    private void drawHeader(PDDocument doc, PDPageContentStream cs, PDPage page, float y, Configuracion config, Long ordenId) throws IOException {
        float rightAlignX = page.getMediaBox().getWidth() - MARGIN;
        
        boolean hasLogo = false;
        if (config.getLogoBase64() != null && config.getLogoBase64().contains(",")) {
            try {
                byte[] imageBytes = Base64.getDecoder().decode(config.getLogoBase64().split(",")[1]);
                PDImageXObject pdImage = PDImageXObject.createFromByteArray(doc, imageBytes, "logo");
                cs.drawImage(pdImage, MARGIN, y - 10, 50, 50);
                hasLogo = true;
            } catch (Exception e) {}
        }
        
        if (!hasLogo) {
            cs.setNonStrokingColor(COLOR_ACCENT);
            cs.addRect(MARGIN, y - 10, 50, 50);
            cs.fill();
            writeText(cs, FONT_BOLD, 14, MARGIN + 10, y + 10, "SISGI", Color.WHITE);
        }

        String empresa = config.getNombreEmpresa() != null ? config.getNombreEmpresa() : "SISGI - Gestión de Inventarios";
        writeText(cs, FONT_BOLD, 18, MARGIN + 65, y + 25, empresa.toUpperCase(), COLOR_PRIMARY);
        writeText(cs, FONT_NORMAL, 10, MARGIN + 65, y + 10, "SISTEMA DE GESTIÓN DE INVENTARIOS", COLOR_SECONDARY);

        cs.setNonStrokingColor(COLOR_BG_HEADER);
        float badgeW = 140;
        cs.addRect(rightAlignX - badgeW, y - 10, badgeW, 50);
        cs.fill();
        cs.setStrokingColor(COLOR_ACCENT);
        cs.setLineWidth(1.5f);
        cs.addRect(rightAlignX - badgeW, y - 10, badgeW, 50);
        cs.stroke();

        writeTextRight(cs, FONT_BOLD, 10, rightAlignX - 10, y + 20, "ORDEN DE COMPRA", COLOR_ACCENT);
        writeTextRight(cs, FONT_BOLD, 16, rightAlignX - 10, y + 0, "#" + String.format("%05d", ordenId), COLOR_PRIMARY);
        
        cs.setStrokingColor(COLOR_BORDER);
        cs.setLineWidth(0.5f);
        cs.moveTo(MARGIN, y - 30);
        cs.lineTo(rightAlignX, y - 30);
        cs.stroke();
    }

    private void drawAddresses(PDPageContentStream cs, float y, Configuracion config, Proveedor prov, LocalDate fecha) throws IOException {
        float x2 = MARGIN + 300;

        cs.setNonStrokingColor(COLOR_ACCENT);
        cs.addRect(MARGIN, y + 5, 2, 12);
        cs.fill();
        writeText(cs, FONT_BOLD, 9, MARGIN + 8, y + 6, "DATOS DEL PROVEEDOR", COLOR_ACCENT);
        
        y -= 20;
        writeText(cs, FONT_BOLD, 11, MARGIN, y, prov.getNombreEmpresa(), COLOR_PRIMARY);
        y -= 15;
        writeText(cs, FONT_NORMAL, 9, MARGIN, y, "NIT/RUC: " + prov.getNitRuc(), COLOR_SECONDARY);
        y -= 12;
        writeText(cs, FONT_NORMAL, 9, MARGIN, y, "Atención: " + prov.getPersonaContacto(), COLOR_SECONDARY);
        y -= 12;
        writeText(cs, FONT_NORMAL, 9, MARGIN, y, "Email: " + prov.getEmail(), COLOR_ACCENT);

        float y2 = y + 59;
        cs.setNonStrokingColor(COLOR_ACCENT);
        cs.addRect(x2, y2 + 5, 2, 12);
        cs.fill();
        writeText(cs, FONT_BOLD, 9, x2 + 8, y2 + 6, "FACTURAR Y ENVIAR A", COLOR_ACCENT);

        y2 -= 20;
        writeText(cs, FONT_BOLD, 11, x2, y2, config.getNombreEmpresa() != null ? config.getNombreEmpresa() : "Variedades Dipal", COLOR_PRIMARY);
        y2 -= 15;
        writeText(cs, FONT_NORMAL, 9, x2, y2, "NIT: " + (config.getNit() != null ? config.getNit() : "N/A"), COLOR_SECONDARY);
        y2 -= 12;
        writeText(cs, FONT_NORMAL, 9, x2, y2, config.getDireccion() != null ? config.getDireccion() : "Dirección no configurada", COLOR_SECONDARY);
        y2 -= 12;
        writeText(cs, FONT_BOLD, 9, x2, y2, "Fecha Emisión: " + fecha.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")), COLOR_PRIMARY);
    }

    private float drawItemsTable(PDPageContentStream cs, PDPage page, float y, OrdenCompra orden) throws IOException {
        float[] colWidths = {260, 50, 90, 95};
        String[] headers = {"Descripción del Producto", "Cant.", "P. Unitario", "Subtotal"};
        float tableWidth = page.getMediaBox().getWidth() - 2 * MARGIN;

        cs.setNonStrokingColor(COLOR_PRIMARY);
        cs.addRect(MARGIN, y - 10, tableWidth, 25);
        cs.fill();

        float x = MARGIN + 10;
        for (int i = 0; i < headers.length; i++) {
            writeText(cs, FONT_BOLD, 9, x, y, headers[i], Color.WHITE);
            x += colWidths[i];
        }

        y -= 35;
        NumberFormat nf = NumberFormat.getCurrencyInstance(new Locale("es", "CO"));

        for (DetalleOrdenCompra d : orden.getDetalles()) {
            writeText(cs, FONT_NORMAL, 9, MARGIN + 10, y, d.getProducto().getNombre(), COLOR_PRIMARY);
            writeText(cs, FONT_NORMAL, 9, MARGIN + colWidths[0] + 10, y, String.valueOf(d.getCantidad()), COLOR_PRIMARY);
            writeText(cs, FONT_NORMAL, 9, MARGIN + colWidths[0] + colWidths[1] + 10, y, nf.format(d.getPrecioUnitario()), COLOR_PRIMARY);
            writeText(cs, FONT_BOLD, 9, MARGIN + colWidths[0] + colWidths[1] + colWidths[2] + 10, y, nf.format(d.getCantidad() * d.getPrecioUnitario()), COLOR_PRIMARY);

            cs.setStrokingColor(COLOR_BORDER);
            cs.setLineWidth(0.5f);
            cs.moveTo(MARGIN, y - 8);
            cs.lineTo(MARGIN + tableWidth, y - 8);
            cs.stroke();

            y -= 25;
        }

        return y;
    }

    private void drawTotals(PDPageContentStream cs, PDPage page, float y, OrdenCompra orden) throws IOException {
        NumberFormat nf = NumberFormat.getCurrencyInstance(new Locale("es", "CO"));
        float rightX = page.getMediaBox().getWidth() - MARGIN;
        float labelX = rightX - 160;

        y -= 10;
        cs.setNonStrokingColor(COLOR_BG_HEADER);
        cs.addRect(MARGIN, y - 50, 280, 60);
        cs.fill();
        cs.setStrokingColor(COLOR_BORDER);
        cs.addRect(MARGIN, y - 50, 280, 60);
        cs.stroke();

        writeText(cs, FONT_BOLD, 8, MARGIN + 10, y, "NOTAS / OBSERVACIONES", COLOR_SECONDARY);
        String obs = orden.getObservaciones() != null ? orden.getObservaciones() : "Sin observaciones adicionales.";
        writeText(cs, FONT_NORMAL, 8, MARGIN + 10, y - 15, obs.length() > 50 ? obs.substring(0, 47) + "..." : obs, COLOR_PRIMARY);

        writeText(cs, FONT_NORMAL, 10, labelX, y, "SUBTOTAL:", COLOR_SECONDARY);
        writeTextRight(cs, FONT_NORMAL, 10, rightX, y, nf.format(orden.getTotal()), COLOR_PRIMARY);

        y -= 25;
        cs.setNonStrokingColor(COLOR_PRIMARY);
        cs.addRect(labelX - 10, y - 10, 170, 35);
        cs.fill();

        writeText(cs, FONT_BOLD, 12, labelX, y, "TOTAL NETO:", Color.WHITE);
        writeTextRight(cs, FONT_BOLD, 14, rightX, y, nf.format(orden.getTotal()), Color.WHITE);
    }

    private void drawFooter(PDPageContentStream cs, PDPage page, Configuracion config) throws IOException {
        float y = 60;
        float width = page.getMediaBox().getWidth();

        cs.setStrokingColor(COLOR_PRIMARY);
        cs.setLineWidth(1f);
        cs.moveTo(MARGIN, y + 20);
        cs.lineTo(width - MARGIN, y + 20);
        cs.stroke();

        String empresa = config.getNombreEmpresa() != null ? config.getNombreEmpresa() : "SISGI";
        String contacto = (config.getEmail() != null ? config.getEmail() : "") + " | " + (config.getTelefono() != null ? config.getTelefono() : "");

        writeTextCenter(cs, FONT_BOLD, 8, width / 2, y + 5, empresa, COLOR_PRIMARY);
        writeTextCenter(cs, FONT_NORMAL, 7, width / 2, y - 5, contacto, COLOR_SECONDARY);
        writeTextCenter(cs, FONT_NORMAL, 7, width / 2, y - 15, "Documento generado por SISGI v2.5 - © " + LocalDate.now().getYear(), COLOR_SECONDARY);
    }

    private void writeText(PDPageContentStream cs, PDType1Font font, float size, float x, float y, String text, Color color) throws IOException {
        cs.beginText();
        cs.setFont(font, size);
        cs.setNonStrokingColor(color);
        cs.newLineAtOffset(x, y);
        cs.showText(text != null ? text : "");
        cs.endText();
    }

    private void writeTextRight(PDPageContentStream cs, PDType1Font font, float size, float x, float y, String text, Color color) throws IOException {
        float width = font.getStringWidth(text != null ? text : "") / 1000 * size;
        writeText(cs, font, size, x - width, y, text, color);
    }

    private void writeTextCenter(PDPageContentStream cs, PDType1Font font, float size, float x, float y, String text, Color color) throws IOException {
        float width = font.getStringWidth(text != null ? text : "") / 1000 * size;
        writeText(cs, font, size, x - (width / 2), y, text, color);
    }
}
