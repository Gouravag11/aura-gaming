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
  const userPic = user?.profilePic || "User";
  const { eventID } = useParams();
  const [eventData, setEventData] = useState(null);
  const [users, setUsers] = useState([]);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState(null);
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
      sendMessage(eventID, userAID, username, newMessage, replyTo);
      setNewMessage('');
      setReplyTo(null); // Clear reply after sending
    }
  };

  const handleReply = (messageID) => {
    setReplyTo(messageID); // Set the messageID to which we are replying
  };

  const handleCancelReply = () => {
    setReplyTo(null); // Cancel the reply action
  };

  if (!eventData || !userAID) return <p>Loading...</p>;

  return (
    <div >
      <div className="game-room-container">
        <div className="chat-area">
          <div className="chat-header">
            <h2>{eventData.title} - Global Chat</h2>
          </div>
          <div className="chat-messages">
            <ul>
              {messages.map(message => (
                <div>
                  <li key={message.id} className="message-container">
                    {message.replyTo && (
                      <div className="message-reply">
                      
                        <a href={`#${message.replyTo}`}>
                          ┌------
                          <strong>@{messages.find((m) => m.id === message.replyTo).username}</strong>
                          <span>{messages.find((m) => m.id === message.replyTo).message}</span>
                        </a>
                        
                      </div>
                    )}
                    <div className="message-container-msg">
                      <div className="message-pfp">
                        <img src={userPic || message.profilePic} alt="User Profile" />
                      </div>
                      <div className="message-content">
                        
                        <div className="message-header">
                          <strong>{message.username}</strong>
                          <span>{new Date(message.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>  
                        </div>
                        <p>{message.message}</p>
                      </div>
                      <div className="context-menu">
                        <ul>
                          <li onClick={() => handleReply(message.id)}>Reply</li>
                          {/* Additional options can be added here, like Edit or Delete */}
                        </ul>
                      </div>
                    </div>
                  </li>
                </div>
              ))}
            </ul>
          </div>
          {replyTo && (
            <div className="replying-to">
              <p>Replying to message: <a href={`#${replyTo}`}>View</a></p>
              <button onClick={handleCancelReply}>Cancel</button>
            </div>
          )}
          
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
  );
};

export default GameRoom;
