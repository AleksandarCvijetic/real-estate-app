package com.realestate.notification_service.service;

import com.realestate.notification_service.event.EmailVerificationRequestedEvent;
import com.realestate.notification_service.event.MessageSentEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${notification.test-recipient-email}")
    private String testRecipientEmail; // TODO (petak): zameniti pozivom GET /users/{receiverId} ka User servisu

    @Value("${notification.frontend-url}")
    private String frontendUrl;

    public void sendVerificationEmail(EmailVerificationRequestedEvent event) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(event.email());
        mail.setSubject("Potvrdite vasu email adresu");
        mail.setText("Zdravo " + event.firstName() + ",\n\n"
                + "Hvala sto ste se registrovali. Da biste aktivirali nalog, potvrdite email adresu klikom na link:\n\n"
                + frontendUrl + "/verify-email?token=" + event.token() + "\n\n"
                + "Link vazi 24 sata. Ako se niste registrovali, ignorisite ovaj mejl.");
        mailSender.send(mail);
    }

    public void sendNewMessageNotification(MessageSentEvent event) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(testRecipientEmail);
        mail.setSubject("Imate novu poruku");
        mail.setText("Dobili ste novu poruku: \"" + event.messageText() + "\"");
        mailSender.send(mail);
    }
}