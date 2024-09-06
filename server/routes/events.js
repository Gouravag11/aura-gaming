const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');

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

router.get('/:eventID', async (req, res) => {
    const { eventID } = req.params;

    try {
        // Fetch event details from the database
        const event = await Event.findOne({ eventID });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(event);
    } catch (err) {
        console.error('Error fetching event:', err);
        res.status(500).json({ message: 'Server error' });
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
    const { eventID, userAID, paymentReference } = req.body;

    try {
        const event = await Event.findOne({ eventID });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const userAlreadyRegistered = event.registeredUsers.find(user => user.userID === userAID);

        if (userAlreadyRegistered) {
            return res.status(400).json({ message: 'User already registered or in process' });
        }

        if (event.fee === 0) {
            // If the event is free, directly confirm the registration
            event.registeredUsers.push({ userID: userAID, status: 'confirmed', paymentReference: '' });
            
            await User.updateOne(
                { userID: userAID },
                { $addToSet: { registeredEvents: { eventID, status: 'active' } } },
                { upsert: true }
            );
            
            await event.save();

            return res.status(201).json({ message: 'User registration confirmed for free event' });
        } else {
            // If the event has a fee, proceed with the existing logic
            event.registeredUsers.push({ userAID, status: 'processing', paymentReference });

            await event.save();

            return res.status(202).json({ message: 'User registration is processing' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Confirm a user's payment for an event
router.post('/confirm', async (req, res) => {
    const { eventID, userID, paymentReference } = req.body;

    try {
        const event = await Event.findOne({ eventID });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const user = event.registeredUsers.find(user => user.userID === userID && user.paymentReference === paymentReference);

        if (!user) {
            return res.status(400).json({ message: 'User or payment reference not found' });
        }

        if (user.status === 'confirmed') {
            return res.status(400).json({ message: 'User already confirmed' });
        }

        user.status = 'confirmed';
        await event.save();

        return res.status(200).json({ message: 'User registration confirmed' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
