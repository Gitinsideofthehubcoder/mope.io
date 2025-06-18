const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Animal evolution chain
const animals = [
  { name: "Mouse", color: "gray", speed: 2.0, startRadius: 20, evolveScore: 0 },
  { name: "Rabbit", color: "pink", speed: 2.2, startRadius: 25, evolveScore: 5 },
  { name: "Pig", color: "brown", speed: 2.4, startRadius: 30, evolveScore: 15 },
  { name: "Deer", color: "tan", speed: 2.6, startRadius: 35, evolveScore: 30 },
  { name: "Lion", color: "goldenrod", speed: 2.8, startRadius: 40, evolveScore: 50 },
];

let player = {
  level: 0,
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: animals[0].startRadius,
  speed: animals[0].speed,
  score: 0
};

let foods = [];

for (let i = 0; i < 20; i++) {
  foods.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: 5 + Math.random() * 5
  });
}

let keys = {};
window.addEventListener('keydown', (e) => { keys[e.key] = true; });
window.addEventListener('keyup', (e) => { keys[e.key] = false; });

function checkEvolution() {
  let nextLevel = player.level + 1;
  if (nextLevel < animals.length && player.score >= animals[nextLevel].evolveScore) {
    player.level = nextLevel;
    player.speed = animals[nextLevel].speed;
    if (player.radius < animals[nextLevel].startRadius) {
      player.radius = animals[nextLevel].startRadius;
    }
    console.log(`Evolved to: ${animals[nextLevel].name}`);
  }
}

function update() {
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

function drawPlayerShape() {
  let animal = animals[player.level];
  ctx.fillStyle = animal.color;
  ctx.strokeStyle = "black";

  switch (animal.name) {
    case "Mouse":
      // Body
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Ears
      ctx.beginPath();
      ctx.arc(player.x - player.radius * 0.6, player.y - player.radius * 0.8, player.radius * 0.3, 0, Math.PI * 2);
      ctx.arc(player.x + player.radius * 0.6, player.y - player.radius * 0.8, player.radius * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;

    case "Rabbit":
      // Body
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Long ears
      ctx.beginPath();
      ctx.ellipse(player.x - player.radius * 0.4, player.y - player.radius * 1.3, player.radius * 0.2, player.radius * 0.6, 0, 0, Math.PI * 2);
      ctx.ellipse(player.x + player.radius * 0.4, player.y - player.radius * 1.3, player.radius * 0.2, player.radius * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;

    case "Pig":
      // Body
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Snout
      ctx.beginPath();
      ctx.arc(player.x, player.y + player.radius * 0.5, player.radius * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = "#FFC0CB"; // Light pink snout
      ctx.fill();
      ctx.stroke();
      break;

    case "Deer":
      // Body
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Antlers
      ctx.beginPath();
      ctx.moveTo(player.x - player.radius * 0.5, player.y - player.radius);
      ctx.lineTo(player.x - player.radius * 0.8, player.y - player.radius * 1.5);
      ctx.moveTo(player.x + player.radius * 0.5, player.y - player.radius);
      ctx.lineTo(player.x + player.radius * 0.8, player.y - player.radius * 1.5);
      ctx.stroke();
      break;

    case "Lion":
      // Body
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Mane outline
      ctx.strokeStyle = "orange";
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius * 1.2, 0, Math.PI * 2);
      ctx.stroke();
      break;

    default:
      // Fallback
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Foods
  ctx.fillStyle = 'green';
  foods.forEach(f => {
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  // Player shape
  drawPlayerShape();

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
