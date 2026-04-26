let isSignUp = false;

// UI Toggles
function togglePremiumMenu(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('premium-dropdown');
    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
}

function togglePlusMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById('plus-menu');
    menu.style.display = (menu.style.display === 'flex') ? 'none' : 'flex';
}

function toggleHistory() { document.getElementById('history-sidebar').classList.toggle('active'); }
function openAuthModal() { document.getElementById('auth-modal').style.display = 'flex'; }
function closeAuthModal() { document.getElementById('auth-modal').style.display = 'none'; }

function toggleAuthMode() {
    isSignUp = !isSignUp;
    document.getElementById('modal-title').innerText = isSignUp ? "Create Account" : "Welcome Back";
    document.querySelector('.auth-submit-btn').innerText = isSignUp ? "Sign Up" : "Continue";
}

window.onclick = () => {
    document.getElementById('plus-menu').style.display = 'none';
    document.getElementById('premium-dropdown').style.display = 'none';
};

// Actions
function openCamera() { document.getElementById('pdf-input').setAttribute('capture', 'camera'); document.getElementById('pdf-input').click(); }
function openFiles() { document.getElementById('pdf-input').removeAttribute('capture'); document.getElementById('pdf-input').click(); }
function startStudy() { document.getElementById('question').value = "I want to study: "; }
function startQuiz() { document.getElementById('question').value = "Generate a quiz for: "; }

// AI logic
async function askQuestion() {
    const qInput = document.getElementById('question');
    const resBox = document.getElementById('result');
    const sendBtn = document.querySelector('.send-btn');
    const q = qInput.value.trim();

    if (!q || sendBtn.classList.contains('loading')) return;

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
}