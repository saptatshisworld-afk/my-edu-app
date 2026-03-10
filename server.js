const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({ storage: multer.memoryStorage() });

let currentBookContext = ""; 

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ Connected to MongoDB Atlas");
        initKnowledge(); 
    })
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Data Schemas
const historySchema = new mongoose.Schema({
    question: String,
    answer: String,
    userEmail: String,
    date: { type: Date, default: Date.now }
});

const bookSchema = new mongoose.Schema({
    title: String,
    content: String,
    userEmail: String,
    uploadDate: { type: Date, default: Date.now }
});

const History = mongoose.model('History', historySchema);
const Book = mongoose.model('Book', bookSchema);

// Admin Route
app.get('/admin.html', (req, res) => {
    if (req.query.pass === "MySecretAdmin2026") {
        res.sendFile(path.join(__dirname, 'admin.html'));
    } else {
        res.status(403).send("Access Denied");
    }
});

// PDF Upload Route
app.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
    try {
        const data = await pdfParse(req.file.buffer);
        const newBook = new Book({
            title: req.file.originalname,
            content: data.text,
            userEmail: "saptatshisworld@gmail.com"
        });
        await newBook.save();
        currentBookContext = data.text; 
        res.json({ message: "Book saved and 'read' successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to process PDF" });
    }
});

// Ask AI Route
app.post('/ask-ai', async (req, res) => {
    const { question } = req.body;
    const finalPrompt = currentBookContext 
        ? `Context: ${currentBookContext}\n\nQuestion: ${question}`
        : question;

    try {
        const aiResponse = "Based on the book: " + question + " is explained as...";
        const newHistory = new History({ 
            question, 
            answer: aiResponse, 
            userEmail: "saptatshisworld@gmail.com" 
        });
        await newHistory.save();
        res.json({ chatgpt: aiResponse });
    } catch (err) {
        res.status(500).json({ error: "AI Error" });
    }
});

app.get('/history', async (req, res) => {
    try {
        const histories = await History.find().sort({ date: -1 });
        res.json(histories);
    } catch (err) {
        res.status(500).json({ error: "History Error" });
    }
});

async function initKnowledge() {
    try {
        const latestBook = await Book.findOne().sort({ uploadDate: -1 });
        if (latestBook) currentBookContext = latestBook.content;
    } catch (err) { console.log("No previous books."); }
}

app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));