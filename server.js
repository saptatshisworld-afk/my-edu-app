const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");

const app = express();

// --- CONFIGURATION ---
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '/')));

// Initialize AI Clients using your Render Environment Variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- MONGODB CONNECTION ---
mongoose.connect(process.env.MONGO_URI || 'your_fallback_mongodb_uri')
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(err => console.error("MongoDB Error:", err));

const historySchema = new mongoose.Schema({
    question: String,
    chatgpt: String, // Keeping the name 'chatgpt' to match your frontend logic
    date: { type: Date, default: Date.now }
});

const History = mongoose.model('History', historySchema);

// --- ROUTES ---

// 1. AI Question Route
app.post('/ask-ai', async (req, res) => {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "No question provided" });

    try {
        // --- CHOICE A: GOOGLE GEMINI (Active) ---
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(question);
        const aiResponse = result.response.text();

        /* // --- CHOICE B: OPENAI CHATGPT (Uncomment to use instead) ---
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: question }],
            model: "gpt-4o-mini",
        });
        const aiResponse = completion.choices[0].message.content;
        */

        // Save to Database
        const newHistory = new History({
            question: question,
            chatgpt: aiResponse 
        });
        await newHistory.save();

        res.json({ chatgpt: aiResponse });

    } catch (error) {
        console.error("AI Error:", error.message);
        res.status(500).json({ chatgpt: "Error: Make sure your API keys are set in Render Environment Variables!" });
    }
});

// 2. History Fetch Route
app.get('/history', async (req, res) => {
    try {
        const data = await History.find().sort({ date: -1 }).limit(10);
        res.json(data);
    } catch (err) {
        res.status(500).send(err);
    }
});

// 3. Serve Frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`EDUCATO Server running on port ${PORT}`));