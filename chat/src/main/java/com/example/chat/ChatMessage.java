package com.example.chat;

public class ChatMessage {
    private String content;
    private String type;
    private String sender;
    public ChatMessage() {

    }

    public ChatMessage(String content, String type, String sender) {
        this.content = content;
        this.type = type;
        this.sender = sender;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    @Override
    public String toString() {
        return "ChatMessage{" +
                "content='" + content + '\'' +
                ", type='" + type + '\'' +
                ", sender='" + sender + '\'' +
                '}';
    }
}
