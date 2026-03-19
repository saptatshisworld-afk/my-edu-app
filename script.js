// Force init on load
window.onload = () => { loadHistory(); };

// Toggle the 7-option menu
function togglePlusMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById('plus-menu');
    menu.style.display = (menu.style.display === 'flex') ? 'none' : 'flex';
}

// 1. Camera
function openCamera() {
    const input = document.getElementById('pdf-input');
    input.setAttribute('capture', 'camera');
    input.setAttribute('accept', 'image/*');
    input.click();
}

// 2, 3, 5. Files / Photos / PDF
function openFiles() {
    const input = document.getElementById('pdf-input');
    input.removeAttribute('capture');
    input.setAttribute('accept', '.pdf,.doc,.docx,.jpg,.png');
    input.click();
}

// Handling File Selection
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        document.getElementById('result').innerHTML += `<div class="user-q"><b>Uploaded:</b> ${file.name}</div>`;
        // Trigger your backend upload logic here
    }
}

// 4. Study & Learn / 6. Quizzes / 7. Create Image
function startStudy() { alert("Starting Study Mode..."); }
function startQuiz() { alert("Generating Quiz..."); }
function createImagePrompt() { 
    document.getElementById('question').value = "Create an image of: "; 
}

// AI Question logic
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

// UI Toggles
function toggleHistory() { document.getElementById('history-sidebar').classList.toggle('active'); }
function togglePremiumMenu() {
    const m = document.getElementById('premium-dropdown');
    m.style.display = m.style.display === 'block' ? 'none' : 'block';
}

// Close menu on outside click
window.onclick = () => { document.getElementById('plus-menu').style.display = 'none'; };