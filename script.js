import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// REPLACE THESE WITH YOUR ACTUAL KEYS FROM FIREBASE SETTINGS
const firebaseConfig = {
  apiKey: "AIzaSyCPgpohdOyA4XvCdFidJDCkEKySzyPX9gQ",
  authDomain: "educato-35d31.firebaseapp.com",
  projectId: "educato-35d31",
  storageBucket: "educato-35d31.firebasestorage.app",
  messagingSenderId: "252748112899",
  appId: "1:252748112899:web:c1eaf0f6a6213199ab1a36",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let isSignUpMode = false;

// Attach functions to 'window' so HTML buttons can access them
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

window.handleAuth = async () => {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    try {
        if (isSignUpMode) {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Account created successfully!");
        } else {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Signed in successfully!");
        }
        window.closeAuthModal();
    } catch (error) {
        alert("Auth Error: " + error.message);
    }
};

window.askQuestion = async () => {
    const input = document.getElementById('user-input');
    const chatContainer = document.getElementById('chat-container');
    const question = input.value.trim();

    if (!question) return;

    chatContainer.innerHTML += `<p><strong>You:</strong> ${question}</p>`;
    input.value = '';

    try {
        const response = await fetch('https://my-edu-app-1.onrender.com/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: question })
        });
        const data = await response.json();
        chatContainer.innerHTML += `<p><strong>EDUCATO:</strong> ${data.response}</p>`;
    } catch (err) {
        chatContainer.innerHTML += `<p><strong>EDUCATO:</strong> AI failed. Check your Gemini Key in Render.</p>`;
    }
    chatContainer.scrollTop = chatContainer.scrollHeight;
};

window.handleKeyPress = (e) => { if (e.key === 'Enter') window.askQuestion(); };
window.togglePlusMenu = (e) => { e.stopPropagation(); alert("Menu coming soon!"); };