import React, { useState } from 'react';
import styles from '../login.module.css';
import axios from "axios";
import bcrypt from 'bcryptjs';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedChats, setSelectedChats] = useState([]);
  const [error, setError] = useState('');

  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleChatSelection = (event) => {
    const chatId = event.target.value;
    const isSelected = event.target.checked;
    if (isSelected) {
      setSelectedChats((prevSelectedChats) => [...prevSelectedChats, chatId]);
    } else {
      setSelectedChats((prevSelectedChats) =>
        prevSelectedChats.filter((chat) => chat !== chatId)
      );
    }
  };

  const saltRounds = 10; // the number of rounds used for salting

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const salt = await bcrypt.genSalt(saltRounds); // generate a unique salt
      const hashedPassword = await bcrypt.hash(password, salt); // hash the password with the salt
      const response = await axios.post("http://localhost:5000/user/create", {
        username: username,
        mailadress: email,
        password: hashedPassword,
        selectedChats: selectedChats
      }, {withCredentials: true});
      console.log(response);
      if (response.data.exists) {
        setError('Username or email already taken');
      }
      if(response.status = 200){
        window.location.href = "/chat";
      }
    } catch (error) {
      console.log('dette er en feil')
    
    }
  };

  return (
    <div className={styles.login}>
      <h2>Log In</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={handleUsernameChange} />
        </label>
        <br />
        <label>
          Email:
          <input type="email" value={email} onChange={handleEmailChange} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <br />
        <div>
          <p>Join Chat Rooms:</p>
          <label>
            <input
              type="checkbox"
              value="chat1"
              onChange={handleChatSelection}
              checked={selectedChats.includes('chat1')}
            />
            Chat 1
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="chat2"
              onChange={handleChatSelection}
              checked={selectedChats.includes('chat2')}
            />
            Chat 2
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="chat3"
              onChange={handleChatSelection}
              checked={selectedChats.includes('chat3')}
            />
            Chat 3
            </label>
      <br />
    </div>
    <button type="submit">Sign up</button>
  </form>
</div>
);
}

export default Login;