import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// --- FIREBASE CONFIGURATION ---
// Replace these placeholders with your actual Firebase project credentials
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

// --- AUTHENTICATION STATE & UI ---
let isSignUp = false;

onAuthStateChanged(auth, (user) => {
    const signInBtn = document.querySelector('.sign-in-btn');
    if (user) {
        signInBtn.innerText = "Sign Out";
        signInBtn.onclick = () => signOut(auth);
        console.log("Logged in as:", user.email);
    } else {
        signInBtn.innerText = "Sign In";
        signInBtn.onclick = openAuthModal;
    }
});

// --- MENU & MODAL TOGGLES ---
window.togglePremiumMenu = (event) => {
    event.stopPropagation();
    const dropdown = document.getElementById('premium-dropdown');
    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
};

window.togglePlusMenu = (event) => {
    event.stopPropagation();
    const menu = document.getElementById('plus-menu');
    menu.style.display = (menu.style.display === 'flex') ? 'none' : 'flex';
};

window.toggleHistory = () => {
    document.getElementById('history-sidebar').classList.toggle('active');
};

window.openAuthModal = () => {
    document.getElementById('auth-modal').style.display = 'flex';
};

window.closeAuthModal = () => {
    document.getElementById('auth-modal').style.display = 'none';
};

window.toggleAuthMode = () => {
    isSignUp = !isSignUp;
    document.getElementById('modal-title').innerText = isSignUp ? "Create Account" : "Welcome Back";
    document.getElementById('modal-subtitle').innerText = isSignUp ? "Join EDUCATO to start your journey." : "Sign in to save your study history.";
    document.querySelector('.auth-submit-btn').innerText = isSignUp ? "Sign Up" : "Continue";
    const toggleLink = document.querySelector('.auth-toggle');
    toggleLink.innerHTML = isSignUp 
        ? 'Already have an account? <a href="#" onclick="toggleAuthMode()">Sign In</a>' 
        : 'Don\'t have an account? <a href="#" onclick="toggleAuthMode()">Sign Up</a>';
};

// Global click handler to close menus
window.onclick = () => {
    const plusMenu = document.getElementById('plus-menu');
    const premiumDropdown = document.getElementById('premium-dropdown');
    if (plusMenu) plusMenu.style.display = 'none';
    if (premiumDropdown) premiumDropdown.style.display = 'none';
};

// --- AUTHENTICATION ACTION ---
window.handleAuth = async (event) => {
    event.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const submitBtn = document.querySelector('.auth-submit-btn');

    submitBtn.disabled = true;
    submitBtn.innerText = "Processing...";

    try {
        if (isSignUp) {
            await createUserWithEmailAndPassword(auth, email, password);
        } else {
            await signInWithEmailAndPassword(auth, email, password);
        }
        closeAuthModal();
    } catch (error) {
        alert("Auth Error: " + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = isSignUp ? "Sign Up" : "Continue";
    }
};

// --- PLUS MENU ACTIONS ---
window.openCamera = () => {
    const input = document.getElementById('pdf-input');
    input.setAttribute('capture', 'camera');
    input.click();
};

window.openFiles = () => {
    const input = document.getElementById('pdf-input');
    input.removeAttribute('capture');
    input.click();
};

window.startStudy = () => { document.getElementById('question').value = "I want to study: "; };
window.startQuiz = () => { document.getElementById('question').value = "Generate a quiz for: "; };
window.createImagePrompt = () => { document.getElementById('question').value = "Create an image of: "; };

// --- CHAT LOGIC ---
window.askQuestion = async () => {
    const qInput = document.getElementById('question');
    const resBox = document.getElementById('result');
    const sendBtn = document.querySelector('.send-btn');
    const q = qInput.value.trim();

    if (!q || sendBtn.classList.contains('loading')) return;

    // UI Update
    resBox.innerHTML += `<div class="user-q"><b>You:</b> ${q}</div>`;
    qInput.value = '';
    sendBtn.classList.add('loading');
    resBox.scrollTop = resBox.scrollHeight;

    try {
        const res = await fetch('/ask-ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: q })
        });
        const data = await res.json();
        resBox.innerHTML += `<div class="ai-res"><b>EDUCATO:</b> ${data.chatgpt}</div>`;
    } catch (err) {
        resBox.innerHTML += `<div class="ai-res" style="color:red;">EDUCATO: Server error.</div>`;
    } finally {
        sendBtn.classList.remove('loading');
        resBox.scrollTop = resBox.scrollHeight;
    }
};