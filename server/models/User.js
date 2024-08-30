const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userID: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    aura: { type: Number, default: 0 },
    // Add more fields as needed
});

const User = mongoose.model('User', userSchema);
module.exports = User;
