import React from 'react';
import { motion } from 'framer-motion';
import GameCarousel from '../components/GameCarousel';

const Home = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <h1>Welcome to Aura Gaming</h1>
            <p>Join a game room and start playing!</p>
            <GameCarousel />
            <div className="home-container">
                <div className="description-section">
                    <h2> Enter Battlegrounds With Allies </h2>
                    <br/>
                    <h5>
                        Aura Gaming is your ultimate hub for joining gaming events and connecting with fellow gamers. 
                        Explore a variety of game rooms like Valorant, PUBG, Apex Legends, and more, all curated by our expert admins. 
                        Whether you're looking to compete or just have fun, Aura Gaming provides the perfect platform to enhance your gaming experience.
                    </h5>
                    <br/>
                    <p>
                        Register now using Google or Steam authentication, join upcoming game rooms, and dive into the action. 
                        Stay tuned for new events and join the community of passionate gamers. 
                        Let the games begin!
                    </p>
                </div>
            </div>
        </motion.div>
        
    );
};

export default Home;
