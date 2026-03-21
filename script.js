window.onload = () => { loadHistory(); };

// Toggle Menu Logic
function togglePlusMenu(event) {
    if (event) event.stopPropagation();
    const menu = document.getElementById('plus-menu');
    // We use 'flex' to respect the 'flex-direction: column' in CSS
    menu.style.display = (menu.style.display === 'flex') ? 'none' : 'flex';
}

// 1. Camera Trigger
function openCamera() {
    const input = document.getElementById('pdf-input');
    input.setAttribute('capture', 'camera');
    input.setAttribute('accept', 'image/*');
    input.click();
    togglePlusMenu();
}

// 2, 3, 5. Files / Photos / PDF
function openFiles() {
    const input = document.getElementById('pdf-input');
    input.removeAttribute('capture');
    input.setAttribute('accept', '.pdf,.doc,.docx,.jpg,.png,.jpeg');
    input.click();
    togglePlusMenu();
}

// 4, 6, 7. Text Prompts
function startStudy() { 
    document.getElementById('question').value = "I want to study: "; 
    togglePlusMenu();
}

function startQuiz() { 
    document.getElementById('question').value = "Generate a quiz about: "; 
    togglePlusMenu();
}

function createImagePrompt() { 
    document.getElementById('question').value = "Create an image of: "; 
    togglePlusMenu();
}

// Global click to close menu
window.onclick = function(event) {
    const menu = document.getElementById('plus-menu');
    if (menu && !event.target.matches('.plus-btn')) {
        menu.style.display = 'none';
    }
}

// AI Interaction
async function askQuestion() {
    const qInput = document.getElementById('question');
    const resBox = document.getElementById('result');
    const q = qInput.value.trim();
    if (!q) return;

    resBox.innerHTML += `<div class="user-q"><b>You:</b> ${q}</div>`;
    qInput.value = '';

    try {
        const res = await fetch('/ask-ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: q })
        });
        const data = await res.json();
        resBox.innerHTML += `<div class="ai-res"><b>EDUCATO:</b> ${data.chatgpt}</div>`;
    } catch (err) {
        resBox.innerHTML += `<div class="ai-res" style="color:red;">Error connecting to server.</div>`;
    }
    resBox.scrollTop = resBox.scrollHeight;
}

function toggleHistory() {
    document.getElementById('history-sidebar').classList.toggle('active');
}