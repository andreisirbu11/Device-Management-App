import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './User.css';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import SensorNotification from './SensorNotification';
import Chat from './Chat';

const User = () => {
  const { userId, username } = useParams();
  const [devices, setDevices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [chatButtonDisabled, setChatButtonDisabled] = useState(false); 

  useEffect(() => {
    // Read the token from session storage
    const storedToken = sessionStorage.getItem('token');

    // Fetch devices using the token
    if (storedToken) {
      fetch(`http://localhost:8081/device/user/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then((data) => setDevices(data))
      .catch((error) => console.error('Error:', error))
    }
  }, [userId]);

  const handleChatButtonClick = () => {
    setShowChat(true);
    setChatButtonDisabled(true);
  };

  const closeChat = () => {
    setShowChat(false);
    setChatButtonDisabled(false);
  };

  useEffect(() => {
    const socket = new SockJS('http://localhost:8082/ws');
    const stompClient = new Client();

    stompClient.webSocketFactory = () => {
      return socket;
    };    

    stompClient.activate();

    stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      const subscription = stompClient.subscribe(`/topic/${userId}`, function (message) {
        console.log('Received message: ' + message.body);
        // Add the received message to the notifications stack
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          { id: new Date().getTime(), message: message.body },
        ]);
      });
      
      return () => {
        subscription.unsubscribe();
      };
    };

    return () => {
      stompClient.deactivate();
    };
  }, [userId]);

  useEffect(() => {
    // Remove the oldest notification after 2 seconds
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications((prevNotifications) => prevNotifications.slice(1));
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [notifications]);

  return (
    <div>

      <div className="user-container">
        <h3 className="user-heading">Devices</h3>
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Address</th>
              <th>Energy</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device.id}>
                <td>{device.id}</td>
                <td>{device.description}</td>
                <td>{device.address}</td>
                <td>{device.energy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Render the notification stack */}
      <SensorNotification notifications={notifications} setNotifications={setNotifications}/>

      {/* Render the chat component conditionally */}
      {showChat && <Chat onClose={closeChat} title={'Support'} userId = {userId} name={username}/>}

      <div className='support-container'>
        {/* Button to open the chat */}
        <button className="chat-button" onClick={handleChatButtonClick} disabled={chatButtonDisabled}>
          Contact support
        </button>
      </div>

    </div>
  );
};

export default User;
