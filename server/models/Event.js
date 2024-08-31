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
    registeredUsers: [
        {
            userID: { type: String, required: true },
            status: { type: String, enum: ['processing', 'confirmed'], default: 'processing' },
            paymentReference: { type: String }  // This will store the payment reference ID
        }
    ]
});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;
