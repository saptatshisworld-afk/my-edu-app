const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '/')));

// Initialize Gemini 2.5 Flash
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("DB Error:", err));

const History = mongoose.model('History', new mongoose.Schema({
    question: String,
    chatgpt: String,
    date: { type: Date, default: Date.now }
}));

// AI Route
app.post('/ask-ai', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(req.body.question);
        const responseText = result.response.text();

        await new History({ question: req.body.question, chatgpt: responseText }).save();
        res.json({ chatgpt: responseText });
    } catch (error) {
        console.error(error);
        res.status(500).json({ chatgpt: "AI failed. Check your Gemini Key in Render." });
    }
});

// History Routes
app.get('/history', async (req, res) => {
    const data = await History.find().sort({ date: -1 }).limit(10);
    res.json(data);
});

app.delete('/clear-history', async (req, res) => {
    await History.deleteMany({});
    res.sendStatus(200);
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`EDUCATO running on port ${PORT}`));