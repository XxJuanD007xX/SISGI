package com.juan.sisgi.sisgi_backend.services;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Envía un correo electrónico con un archivo PDF como adjunto.
     *
     * @param destinatario La dirección de correo del destinatario.
     * @param asunto El asunto del correo.
     * @param cuerpo El contenido HTML del correo.
     * @param pdfBytes Los bytes del archivo PDF a adjuntar.
     * @param nombreAdjunto El nombre que tendrá el archivo PDF adjunto.
     */
    public void enviarCorreoConAdjunto(String destinatario, String asunto, String cuerpo, byte[] pdfBytes, String nombreAdjunto) {
        try {
            MimeMessage message = mailSender.createMimeMessage();

            // Usamos MimeMessageHelper para facilitar la construcción del correo
            // El 'true' indica que será un correo multipart (necesario para adjuntos)
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("juandiegosierramoreno@gmail.com");
            helper.setTo(destinatario);
            helper.setSubject(asunto);
            
            // El 'true' indica que el cuerpo del mensaje es HTML
            helper.setText(cuerpo, true); 

            // Adjuntamos el PDF
            helper.addAttachment(nombreAdjunto, new ByteArrayResource(pdfBytes));

            mailSender.send(message);

        } catch (Exception e) {
            // En un caso real, aquí podrías manejar el error de forma más robusta
            e.printStackTrace();
            throw new RuntimeException("Error al enviar el correo: " + e.getMessage());
        }
    }
}