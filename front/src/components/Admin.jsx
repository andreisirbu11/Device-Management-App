import React, { useState, useEffect } from 'react';
import './Admin.css'

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);

  const [newUserData, setNewUserData] = useState({ username: '', password: '', userRole: '' });
  const [newDeviceData, setNewDeviceData] = useState({ description: '', address: '', energy: '', user_id: '' });

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/user')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error:', error));

    fetch('http://localhost:8081/device')
      .then((response) => response.json())
      .then((data) => setDevices(data))
      .catch((error) => console.error('Error:', error));
  }, []);

  const handleUserSubmit = (e) => {
    e.preventDefault();

    if (selectedUser) {
      // Update existing user
      fetch(`http://localhost:8080/user/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
      })
        .then((response) => response.json())
        .then((data) => {
          setUsers(users.map(user => user.id === selectedUser.id ? data : user))
          setSelectedUser(null);
          setNewUserData({ username: '', password: '', userRole: ''});
        })
        .catch((error) => console.error('Error:', error));
    } else {
      // Create new user
      fetch('http://localhost:8080/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
      })
        .then((response) => response.json())
        .then((data) => setUsers([...users, data]))
        .catch((error) => console.error('Error:', error));
    }
    setNewUserData({ username: '', password: '', userRole: '' });
  };
  
  const handleDeviceSubmit = (e) => {
    e.preventDefault();

    if (selectedDevice) {
      // Update existing device
      fetch(`http://localhost:8081/device/${selectedDevice.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDeviceData),
      })
        .then((response) => response.json())
        .then((data) => {
          setDevices(devices.map(device => device.id === selectedDevice.id ? data : device));
          setSelectedDevice(null);
          setNewDeviceData({description: '', address: '', energy: '', user_id: ''})
        })
        .catch((error) => console.error('Error:', error));
    } else {
      // Create new device
      fetch(`http://localhost:8081/device/user/${newDeviceData.user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDeviceData),
      })
        .then((response) => response.json())
        .then((data) => setDevices([...devices, data]))
        .catch((error) => console.error('Error:', error));
    }
    setNewDeviceData({ description: '', address: '', energy: '', user_id: ''});
  };

  const editUser = (user) => {
    setSelectedUser(user);
    setNewUserData({...user});
  };

  const editDevice = (device) => {
    setSelectedDevice(device);
    setNewDeviceData({...device });
  };

  const deleteUser = (userId) => {
    fetch(`http://localhost:8080/user/${userId}`, {
      method: 'DELETE',
    })
      .then(() => setUsers(users.filter((user) => user.id !== userId)))
      .catch((error) => console.error('Error:', error));
  };

  const deleteDevice = (deviceId) => {
    fetch(`http://localhost:8081/device/${deviceId}`, {
      method: 'DELETE',
    })
      .then(() => setDevices(devices.filter((device) => device.id !== deviceId)))
      .catch((error) => console.error('Error:', error));
  };
  
  return (
    <div>
      <h2>Admin Dashboard</h2>

      <div>
        <h3>Users</h3>
        <form onSubmit={handleUserSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={newUserData.username}
            onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={newUserData.password}
            onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
          />
          <input
            type="text"
            placeholder="User Role"
            value={newUserData.userRole}
            onChange={(e) => setNewUserData({ ...newUserData, userRole: e.target.value })}
          />
          <button type="submit">{selectedUser ? 'Update User' : 'Add User'}</button>
        </form>

        <ul>
          {users.map((user) => (
            <li key={user.id}>
              Id: {user.id}, Username: {user.username}, Role: {user.userRole}{' '}
              <button onClick={() => editUser(user)}>Edit</button>{' '}
              <button onClick={() => deleteUser(user.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Devices</h3>
        <form onSubmit={handleDeviceSubmit}>
          <input
            type="text"
            placeholder="Description"
            value={newDeviceData.description}
            onChange={(e) => setNewDeviceData({ ...newDeviceData, description: e.target.value })}
          />
          <input
            type="text"
            placeholder="Address"
            value={newDeviceData.address}
            onChange={(e) => setNewDeviceData({ ...newDeviceData, address: e.target.value })}
          />
          <input
            type="text"
            placeholder="Energy"
            value={newDeviceData.energy}
            onChange={(e) => setNewDeviceData({ ...newDeviceData, energy: e.target.value })}
          />
          <input
            type="text"
            placeholder="User ID"
            value={newDeviceData.user_id || ''}
            onChange={(e) => setNewDeviceData({ ...newDeviceData, user_id: e.target.value })}
          />
          <button type="submit">{selectedDevice ? 'Update Device' : 'Add Device'}</button>
        </form>

        <ul>
          {devices.map((device) => (
            <li key={device.id}>
              Id: {device.id}, Description: {device.description}, Address: {device.address}, Energy: {device.energy}, User Id: {device.user_id}{' '}
              <button onClick={() => editDevice(device)}>Edit</button>{' '}
              <button onClick={() => deleteDevice(device.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Admin;
