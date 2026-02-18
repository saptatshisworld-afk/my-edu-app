// 1. Function to handle the AI Question (Fixed name to match your HTML onclick)
async function askQuestion() {
    const questionElement = document.getElementById('userQuestion');
    const resultBox = document.getElementById('result-box');
    
    // Get the value from the textarea
    const question = questionElement.value;

    if (!question) {
        alert("Please type a question first!");
        return;
    }

    // Show loading state
    resultBox.innerText = "Thinking...";

    try {
        // We use '/ask-ai' (Relative Path) so it works on Render
        const response = await fetch('/ask-ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: question }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        // Display the answer (adjusting to show the ChatGPT property from your server)
        resultBox.innerText = data.chatgpt || "No response from AI.";
        
        // Refresh the history list after a new question
        loadHistory();

    } catch (error) {
        console.error('Error:', error);
        resultBox.innerText = "Error: Could not reach the server. Make sure your Render app is Live.";
    }
}

// 2. Function to load History from MongoDB
async function loadHistory() {
    const historyList = document.getElementById('historyList');
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
        historyList.innerHTML = "<p>Could not load history.</p>";
    }
}

// 3. Automatically load history when the page opens
window.onload = loadHistory;