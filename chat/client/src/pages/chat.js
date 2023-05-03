import React, { useState, useCallback } from 'react';
import styles from '../chat.module.css';
import axios from 'axios';


function ChatApp() {
  const [inputValue, setInputValue] = useState('');
  const [chats, setChats] = useState({
    chat1: {
      member1: [],
      member2: [],
      member3: [],
    },
    chat2: {
      member1: [],
      member2: [],
      member3: [],
    },
    chat3: {
      member1: [],
      member2: [],
      member3: [],
    },
  });
  const [currentChat, setCurrentChat] = useState('chat1');
  const [members] = useState(['member1', 'member2', 'member3']);
  const [availableChats] = useState(['chat1', 'chat2', 'chat3']);

  const handleInput = useCallback((event) => {
    setInputValue(event.currentTarget.value);
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    if (!inputValue.trim()) {
      return;
    }


    setChats((prevChats) => {
      const chatId = currentChat;
      const memberId = 'member1'; // TODO: Change to the ID of the currently logged-in user
      const newMessage = {
        text: inputValue,
        timestamp: new Date().toISOString(),
      };
      const updatedChat = {
        ...prevChats[chatId],
        [memberId]: [...prevChats[chatId][memberId], newMessage],
      };
      return {
        ...prevChats,
        [chatId]: updatedChat,
      };
    });
    setInputValue('');
  }, [currentChat, inputValue]);

  const handleChatChange = useCallback((event) => {
    setCurrentChat(event.currentTarget.value);
  }, []);

  const currentChatMembers = chats[currentChat] || {};

  return (
    <div className={styles.chatApp}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <div className={styles.sidebar}>
        <div className={styles.chats}>
          <div className={styles.chatHeader}>Chats</div>
          <ul>
            {availableChats.map(chat => (
              <li key={chat}>
                <button
                  className={currentChat === chat ? 'active' : ''}
                  value={chat}
                  onClick={handleChatChange}
                >
                  {chat}
                </button>
              </li>
            ))}
          </ul>
        </div>
  
        <div className={styles.members}>
          <div className={styles.chatHeader}>Members</div>
          <ul>
            {members.map(member => (
              <li key={member}>{member}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.chatMain}>
        <div className={styles.chatHeader}>{currentChat}</div>
        <div className={styles.chatBody}>
          {currentChatMembers[members[0]]?.map((message, index) => (
            <ChatMessage key={index} message={message.text} timestamp={message.timestamp} />
          ))}
        </div>
        <div className={styles.chatFooter}>
          <form className={styles.inputContainer} onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={handleInput}
              maxLength="500"
            />
            <button className={styles.sendButton} type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
  
}

function ChatMessage({ message, timestamp }) {
  const formattedTimestamp = new Date(timestamp).toLocaleString();
  return (
    <div className={styles.messageContainer}>
      <div className={styles.messageSent}>{message}</div>
      <div className={styles.timestamp}>{formattedTimestamp}</div>
    </div>
  );
}


export default ChatApp;