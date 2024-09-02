// src/utils/messages.js
import { ref, push, set, onValue } from 'firebase/database';
import { database } from '../firebase';

// Send a message to a specific event chatroom
export const sendMessage = (eventID, userID, username, message) => {
  const messageRef = push(ref(database, `chats/${eventID}`));
  set(messageRef, {
    userID,
    username,
    message,
    timestamp: new Date().toLocaleString(),
  });
};

// Fetch messages from a specific event chatroom
export const fetchMessages = (eventID, callback) => {
  const messagesRef = ref(database, `chats/${eventID}`);
  onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const messagesArray = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      callback(messagesArray);
    }
  });

  return () => onValue(messagesRef, () => {}); // Detach the listener when component unmounts
};
