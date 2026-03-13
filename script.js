// 1. Ask AI Function
async function askQuestion() {
    const questionElement = document.getElementById('question');
    const resultBox = document.getElementById('result');
    const question = questionElement.value;

    if (!question) return;

    resultBox.innerHTML += `<p><strong>You:</strong> ${question}</p>`;
    questionElement.value = '';

    try {
        const response = await fetch('/ask-ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: question })
        });

        const data = await response.json();
        resultBox.innerHTML += `<p style="color:#f39c12;"><strong>EDUCAT:</strong> ${data.chatgpt}</p>`;
        resultBox.scrollTop = resultBox.scrollHeight;
    } catch (error) {
        resultBox.innerHTML += `<p style="color:red;">Error connecting to server.</p>`;
    }
}

// 2. Menu Toggles
function toggleHistory() {
    const sidebar = document.getElementById('history-sidebar');
    sidebar.classList.toggle('active');
    if (sidebar.classList.contains('active')) loadHistory();
}

function togglePremiumMenu() {
    const menu = document.getElementById('premium-dropdown');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// 3. Load History from MongoDB
async function loadHistory() {
    const historyList = document.getElementById('historyList');
    try {
        const response = await fetch('/history');
        const data = await response.json();
        if (Array.isArray(data)) {
            historyList.innerHTML = data.map(item => `
                <div style="border-bottom:1px solid #eee; padding:10px 0;">
                    <small>${new Date(item.date).toLocaleDateString()}</small><br>
                    <strong>Q:</strong> ${item.question}
                </div>
            `).join('');
        }
    } catch (e) { console.log("History error"); }
}

// 4. PDF Upload
async function openPdfUpload() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/pdf';
    fileInput.onchange = async e => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('pdf', file);
        alert("Reading book...");
        await fetch('/upload-pdf', { method: 'POST', body: formData });
        alert("Book ready!");
    };
    fileInput.click();
}