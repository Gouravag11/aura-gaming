import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import GameRooms from './pages/GameRooms';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './styles/App.css';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route
                        path="/game-rooms"
                        element={
                            <ProtectedRoute>
                                <GameRooms />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
