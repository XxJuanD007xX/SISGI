package com.juan.sisgi.sisgi_backend;

import java.util.Properties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class MailConfig {

    /**
     * Este método crea y configura el objeto JavaMailSender de forma explícita.
     * Al no usar @Value, evitamos problemas de lectura del archivo application.properties
     * y aseguramos que el componente (Bean) se cree siempre.
     */
    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        
        // --- VALORES CONFIGURADOS DIRECTAMENTE ---
        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);
        mailSender.setUsername("juandiegosierramoreno@gmail.com");
        mailSender.setPassword("peqb ebxo yuhp jpri"); // Tu contraseña de aplicación

        // --- PROPIEDADES SMTP ---
        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        // props.put("mail.debug", "true"); // Descomenta para ver logs detallados del envío

        return mailSender;
    }
}