const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// MIDDLEWARE - Crucial for reading your questions
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // This fixes the "Cannot GET /" error

// MONGODB CONNECTION
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
// 1. Serve the Home Page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// 2. Handle AI Question
app.post('/ask-ai', async (req, res) => {
    const { question } = req.body;
    try {
        // Simple mock response - replace with your OpenAI logic if needed
        const aiAnswer = `Educato AI says: I received your question: "${question}"`;
        
        // Save to Database
        const newHistory = new History({ question, answer: aiAnswer });
        await newHistory.save();

        res.json({ chatgpt: aiAnswer });
    } catch (error) {
        res.status(500).json({ error: "Failed to process AI request" });
    }
});

// 3. Get History
app.get('/history', async (req, res) => {
    const logs = await History.find().sort({ date: -1 });
    res.json(logs);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});