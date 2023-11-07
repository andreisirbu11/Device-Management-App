import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LogIn.css';

const LogIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    let foundUser;

    useEffect(() => {
        fetch('http://localhost:8080/user')
          .then((response) => response.json())
          .then((data) => setUsers(data))
          .catch((error) => console.error('Error:', error));
    }, []);

    const checkUserCredentials = (username, password, users) => {
        for (const user of users) {
          if (user.username === username && user.password === password) {
            foundUser = user;
            return true; 
          }
        }
        return false; 
      };
      
    const handleSubmit = (e) => {
        e.preventDefault();
        let verify = checkUserCredentials(username, password, users);
        if(verify === true) {
            if(foundUser.userRole === 'user') {
                navigate(`/user/${foundUser.id}`);
            }
            else if(foundUser.userRole === 'admin') {
                navigate('/admin');
            }
            else {
                // userul nu are nici un role
                navigate('/');
            }
        }
        else {
            alert('No user found');
        }
    };

    return (
        <div>
            <div className="login-container">
                <h1>Login</h1>
                <input className="login-input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" type="text"/>
                <input className="login-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" />
                <button className="login-button" onClick={handleSubmit}>Submit</button>
            </div>
            <div className="login-footer">
                <a href="">If you don't have an account already, sign up here!</a>
            </div>
        </div>
    )
}

export default LogIn