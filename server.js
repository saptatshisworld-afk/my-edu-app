const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '/')));

// Initialize AI Clients using Render Environment Variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(err => console.error("MongoDB Error:", err));

const historySchema = new mongoose.Schema({
    question: String,
    chatgpt: String, 
    date: { type: Date, default: Date.now }
});
const History = mongoose.model('History', historySchema);

// AI Question Route
app.post('/ask-ai', async (req, res) => {
    const { question } = req.body;
    try {
        // --- USING GEMINI (Fast & Free Tier) ---
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(question);
        const aiResponse = result.response.text();

        // Save to MongoDB
        const newHistory = new History({ question, chatgpt: aiResponse });
        await newHistory.save();

        res.json({ chatgpt: aiResponse });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ chatgpt: "I'm having trouble connecting to the AI. Check your API keys in Render!" });
    }
});

// History Route
app.get('/history', async (req, res) => {
    const data = await History.find().sort({ date: -1 }).limit(10);
    res.json(data);
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));