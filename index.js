const express = require('express');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// In-memory database (simple set to store user IDs)
const userIds = new Set();

// Middleware to parse JSON bodies (for POST requests)
app.use(express.json());

// Middleware to parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // limit each IP to 30 requests per minute
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Middleware to check API key
app.use((req, res, next) => {
    const apiKey = req.header('x-api-key');
    if (apiKey !== process.env.API_KEY) {
        return res.status(403).json({ error: 'Forbidden: Invalid API key' });
    }
    next();
});

// Route to check if a user exists
app.get('/check_user', (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }

    const exists = userIds.has(id);
    return res.json({ exists: { [id]: exists } });
});

// Route to add a user
app.get('/add_user', (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }

    if (userIds.has(id)) {
        return res.status(409).json({ error: "ID already exists" });
    }

    userIds.add(id);
    return res.status(201).json({ message: `ID ${id} added` });
});

// Route for the main page
app.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to the User API</h1>
        <p>Available routes:</p>
        <ul>
            <li><strong>/check_user</strong> - Check if a user exists (GET)</li>
            <li><strong>/add_user</strong> - Add a new user (GET)</li>
        </ul>
    `);
});

// Middleware to handle errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
