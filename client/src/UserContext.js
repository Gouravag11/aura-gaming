import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          username: user.displayName,
          profilePic: user.photoURL
          
          // Add other user details you want to store globally
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};
