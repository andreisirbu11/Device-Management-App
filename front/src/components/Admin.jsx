import React, { useState, useEffect } from 'react';
import './Admin.css';
import Chat from './Chat';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);

  const [newUserData, setNewUserData] = useState({ username: '', password: '', userRole: '' });
  const [newDeviceData, setNewDeviceData] = useState({ description: '', address: '', energy: '', user_id: '' });

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const [isEnergyInputDisabled, setIsEnergyInputDisabled] = useState(false);
  const [isUserIDInputDisabled, setIsUserIDInputDisabled] = useState(false);

  const [selectedChatUsers, setSelectedChatUsers] = useState([]);
  // Read the token from session storage
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    // Fetch users and devices using the token
    if (token) {
      fetch('http://localhost:8080/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error:', error));

    fetch('http://localhost:8081/device', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => setDevices(data))
      .catch((error) => console.error('Error:', error));
    }
  }, []);

  const handleSelectUserForChat = (user) => {
    // Check if the user is already selected
    if (!selectedChatUsers.find((selectedUser) => selectedUser.id === user.id)) {
      setSelectedChatUsers([...selectedChatUsers, user]);
    }
  };  

  const handleCloseChat = (userId) => {
    setSelectedChatUsers(selectedChatUsers.filter((user) => user.id !== userId));
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();

    if (selectedUser && token) {
      // Update existing user
      const newUser = {
        username: newUserData.username,
        password: newUserData.password,
        userRole: newUserData.userRole
      }
      console.log(newUser);
      fetch(`http://localhost:8080/user/edit/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
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
          Authorization: `Bearer ${token}`,
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

    if (selectedDevice && token) {
      // Update existing device
      setIsEnergyInputDisabled(false);
      setIsUserIDInputDisabled(false);

      fetch(`http://localhost:8081/device/${selectedDevice.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
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
          Authorization: `Bearer ${token}`,
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
    setIsEnergyInputDisabled(true);
    setIsUserIDInputDisabled(true);
    setSelectedDevice(device);
    setNewDeviceData({...device });
  };

  const deleteUser = (userId) => {
    if(token) {
      fetch(`http://localhost:8080/user/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(() => setUsers(users.filter((user) => user.id !== userId)))
      .catch((error) => console.error('Error:', error));
    }
  };

  const deleteDevice = (deviceId) => {
    if(token) {
      fetch(`http://localhost:8081/device/${deviceId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(() => setDevices(devices.filter((device) => device.id !== deviceId)))
      .catch((error) => console.error('Error:', error));
    }
  };
  
  return (
    <div>
      <h2>Admin Dashboard</h2>

      <div className='container'>
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
          <button className='blue-button' type="submit">{selectedUser ? 'Update User' : 'Add User'}</button>
        </form>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.userRole}</td>
              <td>
                <button className='red-button' onClick={() => editUser(user)}>Edit</button>{' '}
                <button className='red-button' onClick={() => deleteUser(user.id)}>Delete</button>
                { user.userRole === 'user' && <button className='blue-button' onClick={() => handleSelectUserForChat(user)}>Chat</button> }
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      <div className='container'>
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
            disabled = {isEnergyInputDisabled}
            value={newDeviceData.energy}
            onChange={(e) => setNewDeviceData({ ...newDeviceData, energy: e.target.value })}
          />
          <input
            type="text"
            placeholder="User ID"
            disabled = {isUserIDInputDisabled}
            value={newDeviceData.user_id || ''}
            onChange={(e) => setNewDeviceData({ ...newDeviceData, user_id: e.target.value })}
          />
          <button className='blue-button' type="submit">{selectedDevice ? 'Update Device' : 'Add Device'}</button>
        </form>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Address</th>
              <th>Energy</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device.id}>
                <td>{device.id}</td>
                <td>{device.description}</td>
                <td>{device.address}</td>
                <td>{device.energy}</td>
                <td>
                  <button className='red-button' onClick={() => editDevice(device)}>Edit</button>{' '}
                  <button className='red-button' onClick={() => deleteDevice(device.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Render multiple chat windows */}
        {selectedChatUsers.map((user) => (
          <Chat 
            key={user.id}
            onClose={() => handleCloseChat(user.id)}
            title={user.username}
            userId={user.id}
            name={'admin'}
          />
        ))}
      </div>
    </div>
  );
};

export default Admin;
