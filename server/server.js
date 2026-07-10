const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(helmet()); // Secures HTTP headers
app.use(cors()); // Allows your React app to communicate with this API
app.use(express.json()); // Parses incoming JSON payloads

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/vault', require('./routes/vault'));

// Connect to MongoDB Docker Container
mongoose.connect('mongodb://127.0.0.1:27017/enterprise-vault')
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => console.error('MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});