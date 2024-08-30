const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events'); // Ensure this path is correct
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes); // Ensure this line is present

app.get('/', (req, res) => {
    res.send('Welcome to Aura Gaming Backend!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/public')));
if (process.env.NODE_ENV === 'production') {
// Serve the static files from the React app
    app.use(express.static(path.join(__dirname, 'client/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}
// Catch-all handler to serve React's index.html for any unknown routes
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client/public', 'index.html'));
// });
