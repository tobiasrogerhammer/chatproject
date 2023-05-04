import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from '../chat.module.css';

function ChatApp({ activeChatroom }) {
  const [newMessage, setNewMessage] = useState('');
  const [chatrooms, setChatrooms] = useState([]);
  const username = sessionStorage.getItem("username");
  const messagesEndRef = useRef()
  
  console.log(username)
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newMessage.trim() === '') {
      return;
    }
    const timestamp = new Date().toLocaleString();
    const message = {
      username: username,
      message: newMessage,
      time: timestamp,
    };
    console.log(message)
    try {
      const response = await axios.post('http://armadillo.pink:25573/get/create', message);
    } catch (error) {
      console.log(error);
    }
    setNewMessage('');
  };

  useEffect(() => {

    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://armadillo.pink:25573/get/messages');
        const messages = response.data.map((message) => ({
          ...message,
          time: new Date(message.time).toLocaleString(),
        }));
        setChatrooms([{ id: activeChatroom, messages }]);
        messagesEndRef.current.scrollIntoView({ behavior: "instant" });
      } catch (error) {
        console.log(error);
      }
    };
    
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 1000)
    return () => {
      clearInterval(intervalId);
    };
  }, [activeChatroom]);



  return (
    <div className={styles.chatApp}>
      <div className={styles.sidebar}>
        <div className={styles.chats}>
          <h2 className={styles.chatHeader}>Chatrooms</h2>
          <ul>
            <li>
              <button className={`${styles.chatButton} ${activeChatroom === 'Teknisk' ? styles.active : ''}`}>Teknisk</button>
            </li>
            <li>
              <button className={`${styles.chatButton} ${activeChatroom === 'Personal' ? styles.active : ''}`}>Personal</button>
            </li>
            <li>
              <button className={`${styles.chatButton} ${activeChatroom === 'Salg' ? styles.active : ''}`}>Salg</button>
            </li>
          </ul>
        </div>
        <div className={styles.members}>
          <h2 className={styles.chatHeader}>Members</h2>
          <ul>
            <li>John</li>
            <li>Mary</li>
            <li>Tom</li>
          </ul>
        </div>
      </div>
      <div className={styles.chatMain}>
        <h2 className={styles.chatHeader}>{activeChatroom} Chatroom</h2>
        <div className={styles.chatBody}>
          {chatrooms.map((chatroom) =>
            chatroom.messages.map((message, index) => (
              <div id={"msg"+index} className ={styles.messageList} key={index}>
                <p>
                <strong>{message.username}:</strong>
                <p className={styles.chatstyle}>{message.message}<p>{message.time}</p></p>
                </p>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <form className={styles.chatFooter} onSubmit={handleSubmit}>
          <div className={styles.inputContainer}>
            <label htmlFor="newMessage">New message:</label>
            <input
              type="text"
              id="newMessage"
              value={newMessage}
              onChange={(event) => setNewMessage(event.target.value)}
            />
            <button type="submit">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatApp;