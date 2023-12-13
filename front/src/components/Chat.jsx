import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import './Chat.css';

const Chat = ({ onClose, title, userId, name}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [stomp, setStomp] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [typingTimeoutRef, setTypingTimeoutRef] = useState(null); 
  const [showTypingNotification, setShowTypingNotification] = useState(false);
  const [lastMessageSeen, setLastMessageSeen] = useState(false);
  
  useEffect(() => {
    const socket = new SockJS('http://localhost:8083/ws');
    const stompClient = new Client();

    stompClient.webSocketFactory = () => {
      return socket;
    };    

    stompClient.activate();

    const onConnectCallback = () => {
      console.log('Connected to WebSocket');
      stompClient.subscribe(`/user/${userId}/queue/private`, (response) => {
        const incomingMessage = JSON.parse(response.body);
    
        if (incomingMessage.type === 'typing' && incomingMessage.sender !== name) {
          setTypingUser(incomingMessage.sender);
          setShowTypingNotification(true);
    
          setTimeout(() => {
            setShowTypingNotification(false);
          }, 4000);
        } 
        if (incomingMessage.type === 'message' ) {
          setShowTypingNotification(false);
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, incomingMessage];
            localStorage.setItem(`chat_messages_${userId}`, JSON.stringify(updatedMessages));
            setLastMessageSeen(false); 
            return updatedMessages;
          });
        }
        if (incomingMessage.type === 'seen' && incomingMessage.sender !== name) {
          setLastMessageSeen(true);
        }
      });
    };    

    stompClient.onConnect = onConnectCallback;
    
    setStomp(stompClient);

    const storedMessages = localStorage.getItem(`chat_messages_${userId}`);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }

    return () => {
      stompClient.deactivate();
    };
  }, [userId, name]);

  const handleTyping = () => {
    if (!isTyping) {
      const typingMessage = {
        content: null,
        type: 'typing',
        sender: name,
      };

      stomp.publish({
        destination: `/app/sendMessage/${userId}`,
        body: JSON.stringify(typingMessage),
      });

      setIsTyping(true);

    } else {
      clearTimeout(typingTimeoutRef);
    }

    setTypingTimeoutRef(setTimeout(() => setIsTyping(false), 2000));
  };

  const handleSendMessage = () => {
    const chatMessage = {
      content: inputMessage,
      type: 'message',
      sender: name,
    };
  
    stomp.publish({
      destination: `/app/sendMessage/${userId}`,
      body: JSON.stringify(chatMessage),
    });
  
    setLastMessageSeen(false);
    // Clear the input field after sending the message
    setInputMessage('');
  };  

  const handleClick = () => {
    if( messages.length !== 0 ){
      if ( messages[messages.length - 1].sender !== name ) {
        const chatMessage = {
          content: inputMessage,
          type: 'seen',
          sender: name,
        };
      
        stomp.publish({
          destination: `/app/sendMessage/${userId}`,
          body: JSON.stringify(chatMessage),
        });
      } 
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="close-chat-button" onClick={onClose}>
          Close
        </button>
        <p>{title}</p>
      </div>
      <div className="chat-body">
        <div className="message-container">
         {messages.map((message, index) => (
            message.content !== null && (
              <div key={index} className={message.sender === 'admin' ? 'admin-message' : 'user-message'}>
                <strong>{message.sender}:</strong> {message.content}
              </div>
            )
          ))}
          {lastMessageSeen && (
            <div className="seen-status">
              <p>Seen</p>
            </div>
        )}
          {showTypingNotification && (
            <div className="typing-notification">
              <p>{`${typingUser} is typing...`}</p>
            </div>
          )}
        </div>
      </div>

      <div className="chat-footer">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onClick={handleClick}
          onChange={(e) => {
            setInputMessage(e.target.value);
            handleTyping();
          }}
        />
        <button className="send-button" onClick={handleSendMessage}>
          Send
        </button>
      </div>

    </div>
  );
};

export default Chat;
