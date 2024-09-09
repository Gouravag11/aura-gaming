import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import GameRooms from './pages/GameRooms';
import GameRoom from './pages/GameRoom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AnimatePresence } from 'framer-motion';
import './styles/App.css';
import PageTransition from './components/PageTransition';
import SplashScreen from './components/SplashScreen';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
    const location = useLocation();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate a loading time (e.g., fetching resources)
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // Adjust the duration as needed

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="App">
            {isLoading ? (
                    <SplashScreen />
                ) : (
                    <>
                        <Navbar />
                            <AnimatePresence mode="wait">
                            <Routes location={location} key={location.pathname}>
                                <Route 
                                    path="/" 
                                    element={
                                        <PageTransition>
                                            <Home />
                                        </PageTransition>
                                    }
                                />
                                <Route 
                                    path="/sign-in" 
                                    element={
                                        <PageTransition>
                                            <SignIn />
                                        </PageTransition>
                                    } 
                                />
                                <Route
                                    path="/game-rooms"
                                    element={
                                        <PageTransition>
                                            <GameRooms />
                                        </PageTransition>
                                    }
                                />
                                <Route 
                                    path="/privacy-policy" 
                                    element={
                                        <PageTransition>
                                        <PrivacyPolicy />
                                        </PageTransition>
                                    } 
                                />
                                <Route 
                                    path="/game-rooms/:eventID" 
                                    element={
                                        <PageTransition>
                                        <GameRoom />
                                        </PageTransition>              
                                    } 
                                />
                            </Routes>
                            </AnimatePresence>
                            {!location.pathname.startsWith('/game-rooms/') && (
                                <Footer />
                            )}
                    </>
                )}
        </div>
    );
}

function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default AppWrapper;
