package com.realestate.notification_service.service;

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

    public void sendNewMessageNotification(MessageSentEvent event) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(testRecipientEmail);
        mail.setSubject("Imate novu poruku");
        mail.setText("Dobili ste novu poruku: \"" + event.messageText() + "\"");
        mailSender.send(mail);
    }
}