import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LogIn.css';

const LogIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
      
    const handleSubmit = (e) => {
        e.preventDefault();

        const user = {
            "username": username,
            "password": password
        }
        
        const authenticateUser = async () => {
            try {
                const response = await fetch('http://localhost:8080/security/authenticate', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user),
                });
            
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
          
                const data = await response.json();
                if(data) {
                    // Save the token in session storage
                    sessionStorage.setItem('token', data.token);
                    if(data.role === 'user') {
                        navigate(`/user/${username}/${data.id}`);
                    }
                    else if(data.role === 'admin') {
                        navigate('/admin');
                    }
                    else {
                        alert('User has no authorization');
                    }
                }
            } catch (error) {
              console.error('Error:', error);
              // Handle the error as needed
              alert('User not found');
            }
          };
          
          // Call the function to authenticate the user
          authenticateUser();          
    };

    return (
        <div>
            <div className="login-container">
                <h1>Login</h1>
                <input className="login-input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" type="text"/>
                <input className="login-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" />
                <button className="login-button" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    )
}

export default LogIn

