// cheats.js
function initCheatMenu() {
  const container = $('#cheatContainer');
  container.empty();

  const resourceList = Object.keys(resources); // adapt to your resource data structure
  resourceList.forEach(name => {
    const res = resources[name];
    const row = $('<div class="cheat-row">')
      .append($('<span>').text(`${res.name || name}`))
      .append($('<button>').text(`+100K ${res.name || name}`).click(() => {
        if (!cheatMode) return alert('Cheats disabled.');
        res.amount += 100000;
        res.updateDisplay && res.updateDisplay();
      }))
      .append($('<button>').text(`Double ${res.name || name} Storage`).click(() => {
        if (!cheatMode) return alert('Cheats disabled.');
        res.storage *= 2;
        res.updateDisplay && res.updateDisplay();
      }));
    container.append(row);
  });
}

$(document).ready(() => {
  initCheatMenu();
});
