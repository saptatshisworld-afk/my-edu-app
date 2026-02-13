import React, { useState } from 'react';

export default function SubscriptionApp() {
  // User Data (In a real app, this comes from your Database/Firebase)
  const [user, setUser] = useState({
    name: "Student",
    isPremium: false,
    dailyUsage: 0
  });

  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  const FREE_LIMIT = 3;

  const handleAsk = (method) => {
    // 1. Check if user is hitting the free limit
    if (!user.isPremium && user.dailyUsage >= FREE_LIMIT) {
      alert("🚀 You've reached your free daily limit! Upgrade for just $1 to ask unlimited questions.");
      return;
    }

    // 2. Logic for AI vs Human
    if (method === 'AI') {
      setResponse("🤖 AI: [Your Answer Here]");
      // Increment usage count for free users
      if (!user.isPremium) {
        setUser({ ...user, dailyUsage: user.dailyUsage + 1 });
      }
    } else {
      if (!user.isPremium) {
        alert("👨‍🏫 Human experts are only available for Premium members ($1).");
      } else {
        setResponse("⏳ Your question has been sent to a teacher!");
      }
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', border: '2px solid #333', borderRadius: '15px' }}>
      <h1>{user.isPremium ? "🌟 Premium Portal" : "📚 Student Portal"}</h1>
      
      {!user.isPremium && (
        <p style={{ color: 'orange' }}>
          Free uses left today: <strong>{FREE_LIMIT - user.dailyUsage}</strong>
        </p>
      )}

      <textarea 
        placeholder="Ask a question about your book..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{ width: '80%', height: '80px' }}
      />

      <div style={{ marginTop: '10px' }}>
        <button onClick={() => handleAsk('AI')}>Ask AI</button>
        <button onClick={() => handleAsk('Human')} style={{ marginLeft: '10px' }}>Ask Human</button>
      </div>

      {response && <div style={{ marginTop: '20px', fontStyle: 'italic' }}>{response}</div>}

      <hr />
      
      {!user.isPremium && (
        <button 
          onClick={() => setUser({...user, isPremium: true})} 
          style={{ background: 'gold', fontWeight: 'bold' }}>
          Upgrade to Premium for $1
        </button>
      )}
    </div>
  );
}
function askQuestion() {
    // 1. Get what the user typed
    const question = document.getElementById('userQuestion').value;
    const book = document.getElementById('bookSelect').value;
    const answerBox = document.getElementById('answer-box');
    const responseText = document.getElementById('responseText');

    if (question === "") {
        alert("Please type a question first!");
        return;
    }

    // 2. Show the answer box
    answerBox.style.display = "block";
    responseText.innerText = "Thinking...";

    // 3. Simulate an AI response (Later we will connect this to a real AI)
    setTimeout(() => {
        responseText.innerText = `You asked about ${book}. The answer to "${question}" is: [This is a sample answer. Soon, we will connect a real AI here!]`;
    }, 1000);
}
function askQuestion() {
    // 1. Grab the elements
    const inputField = document.getElementById('userQuestion');
    const display = document.getElementById('answer-display');

    // 2. Get the actual text typed
    const userText = inputField.value;

    // 3. Check if it's empty
    if (userText === "") {
        display.innerText = "❌ Please type a question first!";
        return;
    }

    /* --- JAVASCRIPT: The AI Brain --- */
let isPremium = false;

// Simulated API calls (In a real app, these fetch from your server)
async function getChatGPTResponse(book, question) {
    // This represents a call to OpenAI
    return new Promise(resolve => setTimeout(() => resolve(`[ChatGPT]: In ${book}, this concept is explained as...`), 2000));
}

async function getGeminiResponse(book, question) {
    // This represents a call to Google Gemini
    return new Promise(resolve => setTimeout(() => resolve(`[Gemini]: According to the text, the key point is...`), 2500));
}

async function askQuestion(mode) {
    const question = document.getElementById('userQuestion').value;
    const book = document.getElementById('bookSelect').value;
    const resultBox = document.getElementById('result-box');
    const resultText = document.getElementById('resultText');

    if (!question) {
        alert("Please type a question!");
        return;
    }

    resultBox.style.display = "block";
    resultText.innerHTML = `<span class="loading-dots">Consulting ChatGPT & Gemini</span>`;

    if (mode === 'AI') {
        try {
            // Run BOTH AI calls at the same time for speed
            const [gptAnswer, geminiAnswer] = await Promise.all([
                getChatGPTResponse(book, question),
                getGeminiResponse(book, question)
            ]);

            // Combine the answers or show the best one
            resultText.innerHTML = `<strong>Best Answer:</strong><br>${gptAnswer}<br><br><strong>Additional Insight:</strong><br>${geminiAnswer}`;
            
        } catch (error) {
            resultText.innerText = "Error connecting to AI services.";
        }
    } else {
        // Human Expert Logic
        resultText.innerText = "Your question has been sent to our human experts.";
    }
}

// Keep your buyPremium and activatePremium functions here as well...

    // 5. Change the text to the answer after 1 second
    setTimeout(() => {
        display.innerText = "Answer: The information you requested is found in Chapter 1 of the book!";
    }, 1000);
}
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("💾 Connected to MongoDB Memory"))
    .catch(err => console.log(err));

// Define what a "Saved Question" looks like
const QuestionSchema = new mongoose.Schema({
    book: String,
    question: String,
    answer: String,
    date: { type: Date, default: Date.now }
});

const History = mongoose.model('History', QuestionSchema);

// NEW ROUTE: Get all past questions
app.get('/history', async (req, res) => {
    const history = await History.find().sort({ date: -1 }).limit(5);
    res.json(history);
});

// UPDATE: Your existing /ask-ai route needs to SAVE the data now
app.post('/ask-ai', async (req, res) => {
    const { book, question } = req.body;
    try {
        // ... (your existing ChatGPT/Gemini code here) ...
        const combinedAnswer = `GPT: ${gptAnswer} | Gemini: ${geminiAnswer}`;

        // SAVE TO MEMORY
        const newEntry = new History({
            book: book,
            question: question,
            answer: combinedAnswer
        });
        await newEntry.save();

        res.json({ chatgpt: gptAnswer, gemini: geminiAnswer });
    } catch (error) { res.status(500).send(error); }
});
async function loadHistory() {
    const response = await fetch('/history');
    const data = await response.json();
    const list = document.getElementById('historyList');
    
    list.innerHTML = data.map(item => `
        <div style="background: #eee; padding: 10px; margin-bottom: 5px; border-radius: 5px;">
            <strong>Q:</strong> ${item.question}<br>
            <small>Book: ${item.book}</small>
        </div>
    `).join('');
}

// Run this when the page loads
window.onload = loadHistory;