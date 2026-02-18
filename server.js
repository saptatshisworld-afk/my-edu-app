const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
// Render uses Port 10000 by default. This ensures it works on their servers.
const PORT = process.env.PORT || 10000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// THIS LINE IS THE FIX: It tells the server to serve your index.html and script.js
app.use(express.static(__dirname)); 

// MONGODB CONNECTION
// Ensure process.env.MONGO_URI is set in your Render "Environment" tab
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// DATABASE SCHEMA (For your history feature)
const HistorySchema = new mongoose.Schema({
    question: String,
    answer: String,
    date: { type: Date, default: Date.now }
});
const History = mongoose.model('History', HistorySchema);

// ROUTES
// 1. Home Route: Sends your HTML file when you visit the link
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// 2. AI Route: Handles the "Ask AI" button clicks
app.post('/ask-ai', async (req, res) => {
    const { question } = req.body;
    try {
        // This is a placeholder response. Replace with your OpenAI/Google logic if needed.
        const aiAnswer = `Educato AI Response for: "${question}"`;
        
        // Save the interaction to MongoDB
        const newHistory = new History({ question, answer: aiAnswer });
        await newHistory.save();

        res.json({ chatgpt: aiAnswer });
    } catch (error) {
        console.error("AI Route Error:", error);
        res.status(500).json({ error: "Failed to process AI request" });
    }
});

// 3. History Route: Loads saved questions
app.get('/history', async (req, res) => {
    try {
        const logs = await History.find().sort({ date: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: "Could not fetch history" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});