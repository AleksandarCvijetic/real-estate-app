package com.realestate.notification_service.service;

import com.realestate.notification_service.client.UserServiceClient;
import com.realestate.notification_service.event.EmailVerificationRequestedEvent;
import com.realestate.notification_service.event.MessageSentEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final UserServiceClient userServiceClient;

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
        userServiceClient.getUser(event.receiverId()).ifPresentOrElse(
                receiver -> {
                    SimpleMailMessage mail = new SimpleMailMessage();
                    mail.setTo(receiver.email());
                    mail.setSubject("Imate novu poruku");
                    mail.setText("Zdravo " + receiver.firstName() + ",\n\n"
                            + "Dobili ste novu poruku: \"" + event.messageText() + "\"");
                    mailSender.send(mail);
                },
                () -> log.warn("Ne mogu da pronadjem korisnika {} - notifikacija o poruci nije poslata",
                        event.receiverId())
        );
    }
}