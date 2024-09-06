const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create a new user
router.post('/', async (req, res) => {
    try {
        const { userID, name, aura, registeredEvents } = req.body;
        const newUser = new User({ userID, name, aura, registeredEvents });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all users
// router.get('/:userID', async (req, res) => {
//     const userID = req.params;
//     try {
//         const user = await User.findOne(userID);
//         if (!user) {
//             return res.status(404).json();
//         }
//         res.json(user);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

router.get('/active-events/:userID', async (req, res) => {
    const {userID}  = req.params;

    try {
        const user = await User.findOne({userID});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
            
        }

        const activeEvents = user.registeredEvents.filter(event => event.status === 'active');
        res.json(activeEvents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
