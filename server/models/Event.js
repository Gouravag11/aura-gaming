const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    
    eventID: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    bannerImage: { type: String, required: true },
    timing: { type: String, required: true },
    hostname: { type: String, required: true },
    fee: { type: Number, default: 0 },
    eventType: { type: String, required: true },
    participationType: { type: String, required: true },
    registeredUsers: [{ type: String }]
});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;
