const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Prevents "Cannot GET /"

// MONGODB CONNECTION
// Ensure MONGO_URI is set in Render Environment tab
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// DATABASE SCHEMA
const HistorySchema = new mongoose.Schema({
    question: String,
    answer: String,
    date: { type: Date, default: Date.now }
});
const History = mongoose.model('History', HistorySchema);

// ROUTES
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle AI Question
app.post('/ask-ai', async (req, res) => {
    try {
        const { question } = req.body;
        
        if (!question) {
            return res.status(400).json({ error: "No question provided" });
        }

        // Response logic
        const aiAnswer = "Educato AI: I received your question: " + question;

        // Save to DB (inside a try-catch so if DB fails, AI still answers)
        try {
            const newHistory = new History({ question, answer: aiAnswer });
            await newHistory.save();
        } catch (dbErr) {
            console.error("DB Save Error:", dbErr);
        }

        res.json({ chatgpt: aiAnswer });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get History
app.get('/history', async (req, res) => {
    try {
        const logs = await History.find().sort({ date: -1 });
        res.json(logs || []); // Always return an array to fix the .map() error
    } catch (error) {
        res.status(500).json([]);
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});