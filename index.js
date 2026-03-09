const API_URL = 'http://localhost:5000/api';

// 1. INITIAL LOAD (Colors & Messages)
window.addEventListener('DOMContentLoaded', async () => {
    // Load Colors
    const cRes = await fetch(`${API_URL}/colors`);
    const colors = await cRes.json();
    colors.forEach(c => renderColor(c.hex, "FROM DATABASE"));

    // Load Messages
    const mRes = await fetch(`${API_URL}/messages`);
    const msgs = await mRes.json();
    msgs.forEach(m => renderMessage(m.user, m.text, "LOADED"));
});

// 2. SIGN UP ACTION
document.getElementById('signUpForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const passcode = document.getElementById('regPass').value;

    await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, passcode })
    });

    const welcome = document.getElementById('welcomeMsg');
    welcome.innerHTML = `⭐ WELCOME, ${name.toUpperCase()}! DATA SAVED TO MONGODB.`;
    welcome.classList.remove('hidden');
    e.target.reset();
});

// 3. COLOR ACTION
async function addColor() {
    const colorHex = document.getElementById('colorInput').value;
    const res = await fetch(`${API_URL}/colors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hex: colorHex })
    });
    const data = await res.json();
    renderColor(data.hex, "SAVED TO DB");
}

function renderColor(hex, status) {
    const stack = document.getElementById('colorStack');
    const row = document.createElement('div');
    row.className = "color-row animate-slide";
    row.innerHTML = `<div class="color-box" style="background:${hex}"></div><div class="flex-grow"><div class="font-black">${hex.toUpperCase()}</div><div class="text-[10px]">${status}</div></div>`;
    stack.prepend(row);
}

// 4. MESSAGE ACTION
document.getElementById('msgForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = document.getElementById('msgUser').value;
    const email = document.getElementById('msgEmail').value;
    const text = document.getElementById('msgContent').value;

    const res = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, email, text })
    });
    const data = await res.json();
    renderMessage(data.user, data.text, "NEW");
    e.target.reset();
});

function renderMessage(user, text, tag) {
    const inbox = document.getElementById('messageInbox');
    const msgCard = document.createElement('div');
    msgCard.className = "p-4 bg-white border-2 border-black animate-pop";
    msgCard.innerHTML = `<div class="flex justify-between items-center mb-1"><strong class="text-xs uppercase">From: ${user}</strong><span class="text-[9px] bg-black text-white px-1">${tag}</span></div><p class="text-xs italic">"${text}"</p>`;
    inbox.prepend(msgCard);
}