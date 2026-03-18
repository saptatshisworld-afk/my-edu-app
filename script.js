window.onload = () => {
    console.log("EDUCATO initialized");
    loadHistory();
};

async function askQuestion() {
    const qInput = document.getElementById('question');
    const resBox = document.getElementById('result');
    const q = qInput.value.trim();
    if (!q) return;

    resBox.innerHTML += `<div class="user-q"><b>You:</b> ${q}</div>`;
    qInput.value = '';
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
        resBox.innerHTML += `<div class="ai-res" style="color:red;">Server connection error.</div>`;
    }
    resBox.scrollTop = resBox.scrollHeight;
}

function toggleHistory() {
    document.getElementById('history-sidebar').classList.toggle('active');
    loadHistory();
}

function togglePremiumMenu() {
    const m = document.getElementById('premium-dropdown');
    m.style.display = m.style.display === 'block' ? 'none' : 'block';
}

async function loadHistory() {
    const list = document.getElementById('historyList');
    try {
        const res = await fetch('/history');
        const data = await res.json();
        list.innerHTML = data.map(i => `
            <div style="font-size:13px; margin-bottom:10px; border-bottom:1px solid #f9f9f9;">
                <strong>Q:</strong> ${i.question.substring(0,30)}...
            </div>
        `).join('');
    } catch (e) { list.innerHTML = "No history found."; }
}

async function clearChat() {
    if (confirm("Delete all history?")) {
        await fetch('/clear-history', { method: 'DELETE' });
        document.getElementById('result').innerHTML = '';
        loadHistory();
    }
}
// Function to trigger the hidden file input
function openPdfUpload() {
    document.getElementById('pdf-input').click();
}

// Function to handle the selected file
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const resBox = document.getElementById('result');
    resBox.innerHTML += `<div class="user-q"><b>Uploaded:</b> ${file.name}</div>`;

    // For now, we show a "Processing" message
    resBox.innerHTML += `<div class="ai-res"><b>EDUCATO:</b> I see your file "${file.name}". (Note: Backend PDF parsing required to read content).</div>`;
}