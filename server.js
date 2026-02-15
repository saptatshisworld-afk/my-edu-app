const express = require('express');
const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors'); // This allows your HTML to talk to your Server
require('dotenv').config();

const app = express();
app.use(express.static(__dirname));
app.use(express.json());
app.use(cors()); // Enable communication between frontend and backend

// 1. Setup AI Clients
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/ask-ai', async (req, res) => {
    const { book, question } = req.body;

    try {
        // 2. Prepare the ChatGPT and Gemini requests
        const gptPromise = openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: `You are an expert on the book ${book}.` }, 
                       { role: "user", content: question }]
        });

        const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        const geminiPromise = geminiModel.generateContent(`Book: ${book}. Question: ${question}`);

        // 3. Fire both at once!
        const [gptResponse, geminiResponse] = await Promise.all([gptPromise, geminiPromise]);

        res.json({
            chatgpt: gptResponse.choices[0].message.content,
            gemini: geminiResponse.response.text()
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "AI services failed to respond." });
    }
});

const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));