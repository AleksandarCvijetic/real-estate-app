package com.realestate.messaging_service.kafka;

import com.realestate.messaging_service.entity.Conversation;
import com.realestate.messaging_service.entity.Message;
import com.realestate.messaging_service.event.MessageSentEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

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
        kafkaTemplate.send(TOPIC, event);
    }

    private Long resolveReceiverId(Message message) {
        Conversation conversation = message.getConversation();
        return message.getSenderId().equals(conversation.getUser1Id())
                ? conversation.getUser2Id()
                : conversation.getUser1Id();
    }
}