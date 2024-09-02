import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/GameRoom.css';
import { fetchMessages, sendMessage } from '../utils/messages';

const GameRoom = () => {
  const user = useUser();
  const userAID = user?.uid;
  const username = user?.username || "anon";
  const { eventID } = useParams();
  const [eventData, setEventData] = useState(null);
  const [users, setUsers] = useState([]);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchEventData = async () => {
        try {
          const response = await fetch(`https://aura-gaming.onrender.com/api/events/${eventID}`);
          if (response.ok) {
            const data = await response.json();
            setEventData(data);
            setUsers(data.registeredUsers);

            const registeredUser = data.registeredUsers.find(u => u.userID === user.uid);
            if (registeredUser && registeredUser.status === 'confirmed') {
              console.log("User Found");

              const unsubscribe = fetchMessages(eventID, setMessages);
              return unsubscribe;
              
            } else {
              navigate('/game-rooms');
            }
          } else {
            navigate('/game-rooms');
          }
        } catch (err) {
          console.error('Error fetching event data:', err);
        }
      };

      fetchEventData();
    } else {
      navigate('/game-rooms');
    }
  }, [user, eventID, navigate]);

  const toggleSidePanel = () => {
    setIsSidePanelOpen(prevState => !prevState);
  };

  const handleSend = () => {
    if (newMessage.trim()) {
      sendMessage(eventID, userAID, username, newMessage);
      setNewMessage('');
    }
  };
  

  if (!eventData || !userAID) return <p>Loading...</p>;

  return (
    <div className="game-room-container">
      <div className="chat-area">
        <div className="chat-header">
          <h2>{eventData.title} - Global Chat</h2>
        </div>
        <div className="chat-messages">
          <ul>
            {messages.map(message => (
              <li key={message.id}>
                <strong>{message.username}</strong>: {message.message} <em>({message.timestamp})</em>
              </li>
            ))}
          </ul>
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
          />
          <button onClick={handleSend}>Send</button>

        </div>
      </div>

      <div className={`divider ${isSidePanelOpen ? 'open' : 'closed'}`} onClick={toggleSidePanel}>
        <span className={`divider-icon ${isSidePanelOpen ? 'open' : 'closed'}`} />
      </div>
      
      <div className={`side-panel ${isSidePanelOpen ? 'open' : 'closed'}`}>
        <div className="side-panel-header">
          <h3>Users</h3>
        </div>
        <ul className="participants-list">
          {users.map((user, index) => (
            <li key={index}>{user.username}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GameRoom;
