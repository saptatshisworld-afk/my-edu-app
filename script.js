import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- CONFIGURATION ---
// Replace these placeholders with your actual keys from Firebase Project Settings
const firebaseConfig = {
  apiKey: "AIzaSyCPgpohdOyA4XvCdFidJDCkEKySzyPX9gQ",
  authDomain: "educato-35d31.firebaseapp.com",
  projectId: "educato-35d31",
  storageBucket: "educato-35d31.firebasestorage.app",
  messagingSenderId: "252748112899",
  appId: "1:252748112899:web:c1eaf0f6a6213199ab1a36",
  measurementId: "G-M5J93M808T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let isSignUpMode = false;

// --- MODAL CONTROLS ---
window.openAuthModal = () => {
    document.getElementById('auth-modal').style.display = 'block';
};

window.closeAuthModal = () => {
    document.getElementById('auth-modal').style.display = 'none';
};

window.toggleAuthMode = () => {
    isSignUpMode = !isSignUpMode;
    document.getElementById('modal-title').innerText = isSignUpMode ? "Sign Up" : "Sign In";
    document.getElementById('auth-toggle-text').innerHTML = isSignUpMode ? 
        "Already have an account? <span onclick='toggleAuthMode()' style='color:blue; cursor:pointer;'>Sign In</span>" : 
        "Don't have an account? <span onclick='toggleAuthMode()' style='color:blue; cursor:pointer;'>Sign Up</span>";
};

// --- AUTHENTICATION LOGIC ---
window.handleAuth = async () => {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    try {
        if (isSignUpMode) {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Success! Account created.");
        } else {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Success! Logged in.");
        }
        window.closeAuthModal();
    } catch (error) {
        alert("Error: " + error.message);
    }
};

// --- AI CHAT LOGIC ---
window.askQuestion = async () => {
    const input = document.getElementById('user-input');
    const chatContainer = document.getElementById('chat-container');
    const prompt = input.value.trim();

    if (!prompt) return;

    chatContainer.innerHTML += `<div class="user-msg"><strong>You:</strong> ${prompt}</div>`;
    input.value = '';

    try {
        const response = await fetch('https://my-edu-app-1.onrender.com/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        const data = await response.json();
        chatContainer.innerHTML += `<div class="ai-msg"><strong>EDUCATO:</strong> ${data.response}</div>`;
    } catch (err) {
        chatContainer.innerHTML += `<div class="error-msg"><strong>EDUCATO:</strong> AI failed. Check Gemini Key in Render.</div>`;
    }
    chatContainer.scrollTop = chatContainer.scrollHeight;
};

window.handleKeyPress = (e) => {
    if (e.key === 'Enter') window.askQuestion();
};

window.togglePlusMenu = (e) => {
    e.stopPropagation();
    alert("Plus menu functionality coming soon!");
};