package com.realestate.messaging_service.kafka;

import com.realestate.messaging_service.entity.Conversation;
import com.realestate.messaging_service.entity.Message;
import com.realestate.messaging_service.event.MessageSentEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Service
@RequiredArgsConstructor
public class MessageEventProducer {

    private final KafkaTemplate<String, MessageSentEvent> kafkaTemplate;
    private static final String TOPIC = "message.sent";

    public void publishMessageSent(Message message) {
        MessageSentEvent event = new MessageSentEvent(
                message.getConversation().getId(),
                message.getSenderId(),
                resolveReceiverId(message),
                message.getText(),
                message.getSentAt()
        );
        // Salje se tek posle commit-a, da obavestenje ne ode za poruku koja nije sacuvana.
        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    kafkaTemplate.send(TOPIC, event);
                }
            });
        } else {
            kafkaTemplate.send(TOPIC, event);
        }
    }

    private Long resolveReceiverId(Message message) {
        Conversation conversation = message.getConversation();
        return message.getSenderId().equals(conversation.getUser1Id())
                ? conversation.getUser2Id()
                : conversation.getUser1Id();
    }
}