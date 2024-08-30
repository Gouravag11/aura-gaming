const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Get all events
router.get('/', async (req, res) => {
    try {
        console.log("happening")
        const events = await Event.find();
        console.log('Fetched events:', events);  // Add this line
        res.json(events);
    } catch (err) {
        console.log("Ghanta kuch ni hai")
        res.status(500).json({ error: err.message });
    }
});



// Create a new event
router.post('/', async (req, res) => {
    try {
        const { eventID, title, description, bannerImage, timing, hostname } = req.body;
        const newEvent = new Event({
            eventID, title, description, bannerImage, timing, hostname, fee, eventType, participationType, registeredUsers
        });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Register a user for an event
router.post('/register', async (req, res) => {
    const { eventID, userID } = req.body;

    try {
        const event = await Event.findOne({ eventID });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.registeredUsers.includes(userID)) {
            return res.status(400).json({ message: 'User already registered' });
        }

        event.registeredUsers.push(userID);
        await event.save();

        return res.status(200).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
