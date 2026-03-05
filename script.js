// 1. Function to ask a question to the AI
async function askQuestion() {
    const questionElement = document.getElementById('question');
    const resultBox = document.getElementById('result');
    const question = questionElement.value;

    if (!question) {
        alert("Please enter a question!");
        return;
    }

    resultBox.innerText = "Thinking...";

    try {
        const response = await fetch('/ask-ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: question })
        });

        const data = await response.json();
        resultBox.innerText = data.chatgpt;
        
        // Refresh history after asking
        loadHistory(); 
    } catch (error) {
        console.error('Error:', error);
        resultBox.innerText = "Error: Could not reach the server. Make sure your Render app is Live.";
    }
}

// 2. Function to load History from MongoDB
async function loadHistory() {
    const historyList = document.getElementById('historyList');
    const premiumDiv = document.getElementById('premium-features');

    // --- IMMEDIATE ADMIN CHECK ---
    // This ensures the Plus icon shows up for you right away
    if (premiumDiv) {
        premiumDiv.style.display = 'block'; 
        console.log("Admin access granted: Plus icon visible.");
    }

    if (!historyList) return;

    try {
        const response = await fetch('/history');
        const data = await response.json();

        // Safety check: only map if data is an actual list (Array)
        if (Array.isArray(data)) {
            historyList.innerHTML = data.map(item => `
                <div style="background: #f9f9f9; padding: 10px; margin-bottom: 8px; border-radius: 5px; border-left: 4px solid #007bff;">
                    <strong>Q:</strong> ${item.question} <br>
                    <small style="color: #666;">${new Date(item.date).toLocaleDateString()}</small>
                </div>
            `).join('');
        } else {
            historyList.innerHTML = "<p>No history yet. Ask a question!</p>";
        }
    } catch (error) {
        console.error('Error loading history:', error);
        historyList.innerHTML = "<p>Database connection is waking up... try again in a moment.</p>";
    }
}

// 3. Function to handle PDF Upload (Triggered by the Plus button)
function openPdfUpload() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/pdf';
    fileInput.onchange = e => {
        const file = e.target.files[0];
        if (file) {
            alert("Uploading: " + file.name + ". (Backend logic coming next!)");
            // You can add your fetch('/upload-pdf') logic here later
        }
    };
    fileInput.click();
}

// 4. Initialize app on load
window.onload = () => {
    loadHistory();
};
