import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './User.css'; 

const User = () => {
  const { userId } = useParams();
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8081/device/user/${userId}`)
      .then((response) => response.json())
      .then((data) => setDevices(data))
      .catch((error) => console.error('Error:', error));
  }, [userId]);

  return (
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
  );
};

export default User;
