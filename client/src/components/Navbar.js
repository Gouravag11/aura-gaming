import React from 'react';
import { Link } from 'react-router-dom';
import { FaSignInAlt, FaGamepad, FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Navbar = () => {
    const { currentUser } = useAuth();

    const handleSignOut = () => {
        signOut(auth).then(() => {
            console.log("User signed out");
        }).catch((error) => {
            console.error("Error during sign out:", error);
        });
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <motion.nav whileHover={{ scale: 1.1 }}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 60 }}
                >
                    <Link to="/" className="logo-link">
                        <img src="/images/logo.png" alt="Aura Gaming Logo" className="logo-img" />
                        <span className="logo-text">Aura Gaming</span>
                    </Link>
                </motion.nav>
            </div>

            
            
            <div className="navbar-center">
                <ul className="navbar-links">
                    {currentUser && (
                        <motion.li whileHover={{ scale: 1.1 }}
                            initial={{ opacity: 0, y: -150 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, type: 'spring', stiffness: 60 }}
                        >
                            <Link to="/game-rooms" className="nav-link">
                                <FaGamepad className="icon" /> Game Rooms
                            </Link>
                        </motion.li>
                    )}
                </ul>
            </div>

            <div className="navbar-right">
                <ul className="navbar-links">
                    {currentUser ? (
                        <motion.li whileHover={{ scale: 1.1 }} onClick={handleSignOut}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ type: 'spring', stiffness: 60 }}
                        >
                            <Link to="/" className="nav-link">
                                <FaSignOutAlt className="icon" /> Sign Out
                            </Link>
                        </motion.li>
                    ) : (
                        <motion.li whileHover={{ scale: 1.1 }}>
                            <Link to="/sign-in" className="nav-link">
                                <FaSignInAlt className="icon" /> Sign In
                            </Link>
                        </motion.li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
