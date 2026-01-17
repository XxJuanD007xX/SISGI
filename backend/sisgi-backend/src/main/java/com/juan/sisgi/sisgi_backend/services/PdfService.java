package com.juan.sisgi.sisgi_backend.services;

import com.juan.sisgi.sisgi_backend.models.DetalleOrdenCompra;
import com.juan.sisgi.sisgi_backend.models.OrdenCompra;
import com.juan.sisgi.sisgi_backend.models.Proveedor;
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
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
public class PdfService {

    // --- NUEVA PALETA DE COLORES SUAVE ---
    private static final Color COLOR_PRIMARY = new Color(225, 29, 72);
    private static final Color COLOR_HEADER_BG = new Color(240, 240, 240); // Gris muy claro
    private static final Color COLOR_TEXT_HEADER = Color.BLACK;
    private static final Color COLOR_TEXT_BODY = new Color(40, 40, 40);
    private static final Color COLOR_WHITE = Color.WHITE;
    private static final Color COLOR_BLACK = Color.BLACK;

    private static final PDType1Font FONT_BOLD = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
    private static final PDType1Font FONT_NORMAL = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
    private static final float MARGIN = 50;

    public ByteArrayInputStream generarPdfDeOrden(OrdenCompra orden) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            try (PDPageContentStream cs = new PDPageContentStream(document, page)) {
                float yPosition = page.getMediaBox().getHeight() - MARGIN;

                drawHeader(cs, page, yPosition, orden);
                yPosition -= 100;
                
                drawAddresseeInfo(cs, yPosition, orden.getProveedor());
                yPosition -= 90;

                yPosition = drawTable(cs, yPosition, orden);
                yPosition -= 20;

                drawTotalsAndNotes(cs, page, yPosition, orden);
                
                drawFooter(cs, page);
            }
            document.save(out);
        }
        return new ByteArrayInputStream(out.toByteArray());
    }

    private void drawHeader(PDPageContentStream cs, PDPage page, float y, OrdenCompra orden) throws IOException {
        // Título principal
        writeText(cs, FONT_BOLD, 28, MARGIN, y, "ORDEN DE COMPRA");
        
        // Línea de acento debajo del título
        drawDividerLine(cs, MARGIN, y - 8, 250);

        // --- BLOQUE CORREGIDO ---
        // Coordenadas base para la sección de detalles
        float detailsBlockX = page.getMediaBox().getWidth() - MARGIN - 200;
        float labelX = detailsBlockX;
        float valueX = detailsBlockX + 100; // Columna para los valores

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd 'de' MMMM, yyyy", new Locale("es", "ES"));
        
        // Escribir las etiquetas en su columna
        writeText(cs, FONT_NORMAL, 10, labelX, y, "Fecha de Emisión:");
        writeText(cs, FONT_NORMAL, 10, labelX, y - 15, "Orden de Compra #:");
        
        // Escribir los valores en su propia columna, evitando el solapamiento
        writeText(cs, FONT_BOLD, 10, valueX, y, orden.getFechaOrden().format(formatter));
        writeText(cs, FONT_BOLD, 10, valueX, y - 15, String.valueOf(orden.getId()));
    }

    private void drawAddresseeInfo(PDPageContentStream cs, float y, Proveedor proveedor) throws IOException {
        float secondColumnX = 320;
        
        // Información del Proveedor
        writeText(cs, FONT_BOLD, 10, MARGIN, y, "PROVEEDOR");
        cs.setStrokingColor(Color.LIGHT_GRAY);
        cs.moveTo(MARGIN, y - 5); cs.lineTo(MARGIN + 250, y - 5); cs.stroke();
        writeText(cs, FONT_BOLD, 10, MARGIN, y - 20, proveedor.getNombreEmpresa());
        writeText(cs, FONT_NORMAL, 9, MARGIN, y - 35, "Contacto: " + proveedor.getPersonaContacto());
        writeText(cs, FONT_NORMAL, 9, MARGIN, y - 50, "Email: " + proveedor.getEmail());
        writeText(cs, FONT_NORMAL, 9, MARGIN, y - 65, "NIT/RUC: " + proveedor.getNitRuc());

        // Información de Envío
        writeText(cs, FONT_BOLD, 10, secondColumnX, y, "ENVIAR A");
        cs.moveTo(secondColumnX, y - 5); cs.lineTo(secondColumnX + 235, y - 5); cs.stroke();
        writeText(cs, FONT_BOLD, 10, secondColumnX, y - 20, "Variedades Dipal");
        writeText(cs, FONT_NORMAL, 9, secondColumnX, y - 35, "Calle Falsa 123, Bodega 5");
        writeText(cs, FONT_NORMAL, 9, secondColumnX, y - 50, "Funza, Cundinamarca, Colombia");
        writeText(cs, FONT_NORMAL, 9, secondColumnX, y - 65, "NIT: 123.456.789-0");
    }

    private float drawTable(PDPageContentStream cs, float y, OrdenCompra orden) throws IOException {
        float[] columnWidths = {260f, 60f, 90f, 105f};
        String[] headers = {"PRODUCTO / DESCRIPCIÓN", "CANT.", "PRECIO UNIT.", "SUBTOTAL"};
        
        drawTableRow(cs, y, columnWidths, headers, FONT_BOLD, COLOR_HEADER_BG, COLOR_TEXT_HEADER, 25);
        y -= 25;

        for (DetalleOrdenCompra detalle : orden.getDetalles()) {
            NumberFormat currency = NumberFormat.getCurrencyInstance(new Locale("es", "CO"));
            String[] rowData = {
                detalle.getProducto().getNombre(),
                String.valueOf(detalle.getCantidad()),
                currency.format(detalle.getPrecioUnitario()),
                currency.format(detalle.getCantidad() * detalle.getPrecioUnitario())
            };
            drawTableRow(cs, y, columnWidths, rowData, FONT_NORMAL, COLOR_WHITE, COLOR_TEXT_BODY, 25);
            y -= 25;
        }
        
        return y;
    }

    private void drawTotalsAndNotes(PDPageContentStream cs, PDPage page, float y, OrdenCompra orden) throws IOException {
        NumberFormat currency = NumberFormat.getCurrencyInstance(new Locale("es", "CO"));
        double subtotal = orden.getDetalles().stream().mapToDouble(d -> d.getCantidad() * d.getPrecioUnitario()).sum();
        double iva = subtotal * 0.19;
        double total = subtotal + iva;

        float totalsXLabel = page.getMediaBox().getWidth() - MARGIN - 200;
        float totalsXValue = page.getMediaBox().getWidth() - MARGIN - 100;

        writeText(cs, FONT_BOLD, 9, MARGIN, y, "OBSERVACIONES:");
        writeText(cs, FONT_NORMAL, 9, MARGIN, y - 15, orden.getObservaciones() != null && !orden.getObservaciones().isEmpty() ? orden.getObservaciones() : "Ninguna.");
        
        y -= 20;
        writeTextRightAlign(cs, FONT_NORMAL, 10, totalsXLabel, y, "Subtotal:");
        writeTextRightAlign(cs, FONT_NORMAL, 10, totalsXValue, y, currency.format(subtotal));
        y -= 20;
        
        writeTextRightAlign(cs, FONT_NORMAL, 10, totalsXLabel, y, "IVA (19%):");
        writeTextRightAlign(cs, FONT_NORMAL, 10, totalsXValue, y, currency.format(iva));
        y -= 5;
        
        cs.setStrokingColor(Color.LIGHT_GRAY);
        cs.moveTo(totalsXLabel, y); cs.lineTo(totalsXValue + 100, y); cs.stroke();
        y -= 20;

        writeTextRightAlign(cs, FONT_BOLD, 12, totalsXLabel, y, "TOTAL:");
        writeTextRightAlign(cs, FONT_BOLD, 12, totalsXValue, y, currency.format(total));
    }

    private void drawFooter(PDPageContentStream cs, PDPage page) throws IOException {
        String footerText = "Documento generado por SISGI | Variedades Dipal | " + LocalDate.now().getYear();
        float textWidth = getTextWidth(FONT_NORMAL, 8, footerText);
        float centerX = (page.getMediaBox().getWidth() - textWidth) / 2;
        writeText(cs, FONT_NORMAL, 8, centerX, 30, footerText);
    }

    // --- MÉTODOS DE AYUDA (HELPERS) PARA DIBUJAR ---

    private void writeText(PDPageContentStream cs, PDType1Font font, float fontSize, float x, float y, String text) throws IOException {
        cs.beginText();
        cs.setFont(font, fontSize);
        cs.newLineAtOffset(x, y);
        cs.showText(text != null ? text : "");
        cs.endText();
    }
    
    private void writeTextRightAlign(PDPageContentStream cs, PDType1Font font, float fontSize, float x, float y, String text) throws IOException {
        float textWidth = getTextWidth(font, fontSize, text);
        writeText(cs, font, fontSize, x - textWidth, y, text);
    }

    private float getTextWidth(PDType1Font font, float fontSize, String text) throws IOException {
        return font.getStringWidth(text != null ? text : "") / 1000f * fontSize;
    }
    
    private void drawDividerLine(PDPageContentStream cs, float x, float y, float width) throws IOException {
        cs.setStrokingColor(COLOR_PRIMARY);
        cs.setLineWidth(2f);
        cs.moveTo(x, y);
        cs.lineTo(x + width, y);
        cs.stroke();
        cs.setLineWidth(1f); // Reset
    }

    private void drawTableRow(PDPageContentStream cs, float y, float[] colWidths, String[] text, PDType1Font font, Color bgColor, Color textColor, float height) throws IOException {
        float x = MARGIN;
        float tableWidth = colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3];
        
        cs.setNonStrokingColor(bgColor);
        cs.addRect(x, y - (height / 2) + 2, tableWidth, height);
        cs.fill();

        cs.setStrokingColor(Color.LIGHT_GRAY);
        cs.moveTo(x, y - (height / 2) + 2);
        cs.lineTo(x + tableWidth, y - (height / 2) + 2);
        cs.stroke();

        cs.setNonStrokingColor(textColor);
        float textY = y + (height / 2) - 12;
        
        // Alinear texto en cada celda
        writeText(cs, font, 9, x + 10, textY, text[0]); // Descripción (izquierda)
        writeTextRightAlign(cs, font, 9, x + colWidths[0], textY, text[1]); // Cantidad (derecha)
        x += colWidths[0];
        writeTextRightAlign(cs, font, 9, x + colWidths[1], textY, text[2]); // P/U (derecha)
        x += colWidths[1];
        writeTextRightAlign(cs, font, 9, x + colWidths[2], textY, text[3]); // Total (derecha)
    }
}