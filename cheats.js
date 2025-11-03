// cheats.js

// Global cheat mode toggle
let cheatMode = false;

// Utility to safely get resources after game loads
function waitForResources(callback) {
    const tryInit = setInterval(() => {
        if (window.resources && Object.keys(window.resources).length) {
            clearInterval(tryInit);
            callback();
        }
    }, 100);
}

// Initialize cheat menu
function initCheatMenu() {
    const container = document.getElementById('cheatContainer');
    if (!container) return;

    container.innerHTML = ''; // Clear any existing content

    Object.keys(resources).forEach(key => {
        const res = resources[key];

        // Row container
        const row = document.createElement('div');
        row.className = 'cheat-row';
        row.style.marginBottom = '8px';

        // Resource label
        const label = document.createElement('span');
        label.textContent = res.name || key;
        label.style.marginRight = '10px';
        row.appendChild(label);

        // Add 100K button
        const addBtn = document.createElement('button');
        addBtn.textContent = '+100K';
        addBtn.style.marginRight = '5px';
        addBtn.onclick = () => {
            if (!cheatMode) return alert('Cheats are disabled.');
            res.amount = (res.amount || 0) + 100000;
            if (typeof res.updateDisplay === 'function') res.updateDisplay();
        };
        row.appendChild(addBtn);

        // Double storage button
        const storageBtn = document.createElement('button');
        storageBtn.textContent = '×2 Storage';
        storageBtn.onclick = () => {
            if (!cheatMode) return alert('Cheats are disabled.');
            res.storage = (res.storage || 0) * 2;
            if (typeof res.updateDisplay === 'function') res.updateDisplay();
        };
        row.appendChild(storageBtn);

        container.appendChild(row);
    });
}

// Initialize cheat menu after game loads
waitForResources(() => {
    initCheatMenu();
});

// Toggle cheat mode from settings
function setCheatMode(enabled) {
    cheatMode = !!enabled;
    const cheatTab = document.getElementById('tab-cheats');
    if (cheatTab) cheatTab.style.display = cheatMode ? 'inline-block' : 'none';
    // Optionally refresh cheat menu visibility
    const container = document.getElementById('cheatContainer');
    if (container) container.style.display = cheatMode ? 'block' : 'none';
}
