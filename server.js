const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname)); // Serves your index.html and script.js

// 1. MongoDB Connection 
// Uses the 'render_user' and 'Educato2026' credentials we set up
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 2. Data Schema
const historySchema = new mongoose.Schema({
    question: String,
    answer: String,
    userEmail: String,
    isPremium: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
});

const History = mongoose.model('History', historySchema);

// 3. Admin Page Route (Fixes the "Not Found" error)
app.get('/admin.html', (req, res) => {
    const password = req.query.pass;
    // This matches the link you were trying to access
    if (password === "MySecretAdmin2026") {
        res.sendFile(path.join(__dirname, 'admin.html'));
    } else {
        res.status(403).send("Access Denied: Incorrect Password");
    }
});

// 4. Update Premium Status Route
app.post('/update-premium', async (req, res) => {
    const { email, isPremium } = req.body;
    try {
        // Update the database so the frontend logic can show the plus icon
        await History.updateMany({ userEmail: email }, { isPremium: isPremium });
        res.json({ message: `Success! ${email} status updated to ${isPremium}` });
    } catch (err) {
        res.status(500).json({ error: "Failed to update user status" });
    }
});

// 5. Get History Route (Feeds your "Recent Questions" box)
app.get('/history', async (req, res) => {
    try {
        const histories = await History.find().sort({ date: -1 });
        res.json(histories);
    } catch (err) {
        res.status(500).json({ error: "Could not fetch history" });
    }
});

// 6. Ask AI Route
app.post('/ask-ai', async (req, res) => {
    const { question } = req.body;
    try {
        // Your existing AI logic goes here
        const aiResponse = "This is a simulated AI response for: " + question;
        
        // Save to MongoDB
        const newHistory = new History({ 
            question, 
            answer: aiResponse,
            userEmail: "saptatshisworld@gmail.com" // Set current user
        });
        await newHistory.save();

        res.json({ chatgpt: aiResponse });
    } catch (err) {
        res.status(500).json({ error: "AI logic failed" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});