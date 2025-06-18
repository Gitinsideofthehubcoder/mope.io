// game.js

import { animals } from './animals.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = {
  level: 0,
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  speed: 2.0,
  score: 0
};

player.radius = 20;
player.speed = 2.0;

let foods = Array.from({length: 20}, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  radius: 5 + Math.random() * 5
}));

let keys = {};
window.addEventListener('keydown', (e) => { keys[e.key] = true; });
window.addEventListener('keyup', (e) => { keys[e.key] = false; });

// Upgrade menu
const menu = document.createElement('div');
menu.style.position = 'absolute';
menu.style.top = '50%';
menu.style.left = '50%';
menu.style.transform = 'translate(-50%, -50%)';
menu.style.background = 'white';
menu.style.padding = '20px';
menu.style.border = '2px solid black';
menu.style.display = 'none';
document.body.appendChild(menu);

function openUpgradeMenu(options) {
  menu.innerHTML = `<h3>Choose next animal:</h3>`;
  options.forEach(opt => {
    let btn = document.createElement('button');
    btn.textContent = opt.name;
    btn.style.margin = '5px';
    btn.onclick = () => {
      player.level = animals.findIndex(a => a.name === opt.name);
      player.radius = 20 + player.level * 5;
      player.speed = 2 + player.level * 0.1;
      menu.style.display = 'none';
    };
    menu.appendChild(btn);
  });
  menu.style.display = 'block';
}

function checkEvolution() {
  let current = animals[player.level];
  let nextOptions = animals.filter(a => a.evolveScore > current.evolveScore && a.evolveScore <= player.score);
  if (nextOptions.length > 0 && menu.style.display === 'none') {
    openUpgradeMenu(nextOptions.slice(0, 3)); // show up to 3 options
  }
}

function update() {
  if (menu.style.display !== 'none') return; // pause game when choosing

  if (keys['ArrowUp']) player.y -= player.speed;
  if (keys['ArrowDown']) player.y += player.speed;
  if (keys['ArrowLeft']) player.x -= player.speed;
  if (keys['ArrowRight']) player.x += player.speed;

  player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
  player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));

  foods = foods.filter(f => {
    let dx = player.x - f.x;
    let dy = player.y - f.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < player.radius + f.radius) {
      player.radius += 0.2;
      player.score += 1;
      return false;
    }
    return true;
  });

  while (foods.length < 20) {
    foods.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 5 + Math.random() * 5
    });
  }

  checkEvolution();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Food
  ctx.fillStyle = 'green';
  foods.forEach(f => {
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  // Player
  ctx.fillStyle = animals[player.level].color;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Info
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${player.score}`, 10, 20);
  ctx.fillText(`Animal: ${animals[player.level].name}`, 10, 45);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();

