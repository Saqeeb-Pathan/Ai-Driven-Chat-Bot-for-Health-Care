// HealthAware AI - Main JavaScript File

// Initialize Lucide icons
lucide.createIcons();

// State management
let messages = [
    {
        id: 1,
        type: 'bot',
        content: "Hi! I'm your Cybersecurity Awareness bot. Ask me anything about phishing, MFA, passwords, or safe browsing. You can also use the tools on the right."
    }
];

let selectedSymptoms = [];
let isAnalyzing = false;

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const suggestionsGrid = document.getElementById('suggestionsGrid');
const roleSelect = document.getElementById('roleSelect');
const quickTipsBtn = document.getElementById('quickTipsBtn');

// Health Tracker elements
const waterIntake = document.getElementById('waterIntake');
const stepsToday = document.getElementById('stepsToday');
const sleepHours = document.getElementById('sleepHours');
const logDataBtn = document.getElementById('logDataBtn');

// Nutrition Analyzer elements
const nutritionSearch = document.getElementById('nutritionSearch');
const scanBtn = document.getElementById('scanBtn');
const analyzeBtn = document.getElementById('analyzeBtn');

// Symptom Checker elements
const symptomInput = document.getElementById('symptomInput');
const addSymptomBtn = document.getElementById('addSymptomBtn');
const commonSymptomsGrid = document.getElementById('commonSymptomsGrid');
const selectedSymptomsContainer = document.getElementById('selectedSymptomsContainer');
const selectedSymptomsList = document.getElementById('selectedSymptomsList');
const checkSymptomsBtn = document.getElementById('checkSymptomsBtn');

// Mindfulness elements
const meditationBtn = document.getElementById('meditationBtn');
const loartQuizBtn = document.getElementById('loartQuizBtn');
const yogaBtn = document.getElementById('yogaBtn');

// Utility functions
function createMessageElement(message) {
    const messageContainer = document.createElement('div');
    messageContainer.className = `message-container ${message.type}`;
    
    const avatar = document.createElement('div');
    avatar.className = message.type === 'bot' ? 'avatar gradient-health' : 'avatar';
    avatar.style.background = message.type === 'user' ? 'var(--primary)' : '';
    
    const icon = document.createElement('i');
    icon.setAttribute('data-lucide', message.type === 'bot' ? 'bot' : 'user');
    avatar.appendChild(icon);
    
    const messageBubble = document.createElement('div');
    messageBubble.className = 'message-bubble';
    
    const messageText = document.createElement('p');
    messageText.textContent = message.content;
    messageBubble.appendChild(messageText);
    
    messageContainer.appendChild(avatar);
    messageContainer.appendChild(messageBubble);
    
    return messageContainer;
}

function addMessage(content, type = 'user') {
    const message = {
        id: Date.now(),
        type: type,
        content: content
    };
    
    messages.push(message);
    
    const messageElement = createMessageElement(message);
    chatMessages.insertBefore(messageElement, chatMessages.lastElementChild.previousElementSibling);
    
    // Re-initialize Lucide icons for new elements
    lucide.createIcons();
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Simulate bot response for user messages
    if (type === 'user') {
        setTimeout(() => {
            const botResponse = generateBotResponse(content);
            addMessage(botResponse, 'bot');
        }, 1000);
    }
}

function generateBotResponse(userMessage) {
    const responses = {
        'phishing': "Phishing emails often have suspicious sender addresses, urgent language, and requests for personal information. Always verify the sender through official channels before clicking links or providing data.",
        'mfa': "Multi-Factor Authentication (MFA) adds an extra layer of security. App-based MFA (like Google Authenticator) is more secure than SMS-based MFA because it's not susceptible to SIM swapping attacks.",
        'password': "Use strong, unique passwords for each account. Consider using a password manager to generate and store complex passwords. Enable MFA whenever possible.",
        'sleep': "For better sleep, maintain a consistent sleep schedule, avoid screens 1 hour before bed, keep your room cool and dark, and consider relaxation techniques like deep breathing.",
        'energy': "Natural energy boosters include getting sunlight exposure, staying hydrated, eating balanced meals with protein and complex carbs, and taking short walks throughout the day.",
        'default': "I understand you're asking about health and security. Could you be more specific about what you'd like to know? I can help with phishing detection, MFA setup, password security, or general wellness tips."
    };
    
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('phish')) return responses.phishing;
    if (lowerMessage.includes('mfa') || lowerMessage.includes('factor')) return responses.mfa;
    if (lowerMessage.includes('password')) return responses.password;
    if (lowerMessage.includes('sleep')) return responses.sleep;
    if (lowerMessage.includes('energy')) return responses.energy;
    
    return responses.default;
}

function createSymptomBadge(symptom) {
    const badge = document.createElement('div');
    badge.className = 'symptom-badge';
    
    const text = document.createElement('span');
    text.textContent = symptom;
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'symptom-remove';
    removeBtn.onclick = () => removeSymptom(symptom);
    
    const removeIcon = document.createElement('i');
    removeIcon.setAttribute('data-lucide', 'x');
    removeBtn.appendChild(removeIcon);
    
    badge.appendChild(text);
    badge.appendChild(removeBtn);
    
    return badge;
}

function addSymptom(symptom) {
    if (!selectedSymptoms.includes(symptom) && symptom.trim()) {
        selectedSymptoms.push(symptom.trim());
        updateSelectedSymptomsDisplay();
        updateCheckSymptomsButton();
        
        // Disable the common symptom button
        const symptomBtns = document.querySelectorAll('.symptom-btn');
        symptomBtns.forEach(btn => {
            if (btn.dataset.symptom === symptom) {
                btn.disabled = true;
            }
        });
    }
}

function removeSymptom(symptom) {
    selectedSymptoms = selectedSymptoms.filter(s => s !== symptom);
    updateSelectedSymptomsDisplay();
    updateCheckSymptomsButton();
    
    // Re-enable the common symptom button
    const symptomBtns = document.querySelectorAll('.symptom-btn');
    symptomBtns.forEach(btn => {
        if (btn.dataset.symptom === symptom) {
            btn.disabled = false;
        }
    });
}

function updateSelectedSymptomsDisplay() {
    selectedSymptomsList.innerHTML = '';
    
    if (selectedSymptoms.length > 0) {
        selectedSymptomsContainer.style.display = 'block';
        selectedSymptoms.forEach(symptom => {
            const badge = createSymptomBadge(symptom);
            selectedSymptomsList.appendChild(badge);
        });
        lucide.createIcons();
    } else {
        selectedSymptomsContainer.style.display = 'none';
    }
}

function updateCheckSymptomsButton() {
    checkSymptomsBtn.disabled = selectedSymptoms.length === 0 || isAnalyzing;
}

function showToast(message, type = 'info') {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--card);
        color: var(--card-foreground);
        padding: 1rem;
        border-radius: 0.5rem;
        border: 1px solid var(--border);
        box-shadow: var(--shadow-health);
        z-index: 1000;
        max-width: 300px;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Event Listeners

// Chat functionality
sendBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        addMessage(message);
        messageInput.value = '';
    }
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});

// Quick suggestions
suggestionsGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('suggestion-btn')) {
        messageInput.value = e.target.dataset.suggestion;
    }
});

// Header functionality
quickTipsBtn.addEventListener('click', () => {
    showToast('Quick Tips: Always verify sender identity, use strong passwords, enable MFA, and trust your instincts about suspicious requests.');
});

// Health Tracker
logDataBtn.addEventListener('click', () => {
    const data = {
        water: waterIntake.value,
        steps: stepsToday.value,
        sleep: sleepHours.value
    };
    
    console.log('Logging health data:', data);
    showToast('Health data logged successfully!');
    
    // Clear inputs
    waterIntake.value = '';
    stepsToday.value = '';
    sleepHours.value = '';
});

// Nutrition Analyzer
analyzeBtn.addEventListener('click', () => {
    const query = nutritionSearch.value.trim();
    if (query) {
        console.log('Analyzing nutrition for:', query);
        showToast(`Analyzing nutrition for: ${query}`);
    }
});

scanBtn.addEventListener('click', () => {
    console.log('Opening camera for barcode scan');
    showToast('Camera functionality would open here');
});

nutritionSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        analyzeBtn.click();
    }
});

// Symptom Checker
addSymptomBtn.addEventListener('click', () => {
    const symptom = symptomInput.value.trim();
    if (symptom) {
        addSymptom(symptom);
        symptomInput.value = '';
    }
});

symptomInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addSymptomBtn.click();
    }
});

commonSymptomsGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('symptom-btn') && !e.target.disabled) {
        addSymptom(e.target.dataset.symptom);
    }
});

checkSymptomsBtn.addEventListener('click', async () => {
    if (selectedSymptoms.length === 0) return;
    
    isAnalyzing = true;
    updateCheckSymptomsButton();
    
    // Update button text and add spinner
    const originalHTML = checkSymptomsBtn.innerHTML;
    checkSymptomsBtn.innerHTML = `
        <div class="loading-spinner"></div>
        Analyzing...
    `;
    
    // Simulate analysis
    setTimeout(() => {
        isAnalyzing = false;
        checkSymptomsBtn.innerHTML = originalHTML;
        updateCheckSymptomsButton();
        showToast('Symptom analysis complete. Please consult a healthcare professional for proper diagnosis.');
        lucide.createIcons();
    }, 2000);
});

// Mindfulness Break
meditationBtn.addEventListener('click', () => {
    console.log('Starting guided meditation');
    showToast('Starting guided meditation session...');
});

loartQuizBtn.addEventListener('click', () => {
    console.log('Starting Loart Quiz');
    showToast('Loart Quiz coming soon!');
});

yogaBtn.addEventListener('click', () => {
    console.log('Starting quick yoga session');
    showToast('Starting quick yoga stretch session...');
});

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('HealthAware AI initialized');
    lucide.createIcons();
});