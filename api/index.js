const express = require('express');
const app = express();

// In-memory database (simple set to store user IDs)
const userIds = new Set();

// Middleware to parse URL-encoded bodies (necessary for form submissions)
app.use(express.urlencoded({ extended: true }));

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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
