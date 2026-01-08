// -------------------- CRASH GAME
let crashBet = 0;
let currentMultiplier = 1.00;
let gameRunning = false;
let gameInterval;
let crashPoint;
let graphData = [];
let history = [];

const canvas = document.getElementById('crashGraph');
const ctx = canvas.getContext('2d');
const multiplierDisplay = document.getElementById('multiplierDisplay');
const crashResult = document.getElementById('crashResult');
const historyList = document.getElementById('historyList');

function initCanvas() {
  ctx.strokeStyle = '#ffcc00';
  ctx.lineWidth = 2;
  ctx.font = '16px Arial';
  ctx.fillStyle = '#fff';
}

function drawGraph() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Escala dinâmica: garante que o gráfico caiba na tela e o movimento seja visível
  const maxVal = Math.max(2, (graphData[graphData.length - 1] || 1) * 1.5);
  const yScale = (canvas.height - 60) / (maxVal - 1);

  // Draw grid with gradient effect
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * (canvas.height / 5));
    ctx.lineTo(canvas.width, i * (canvas.height / 5));
    ctx.stroke();
  }

  // Draw multiplier line with gradient and glow effect
  if (graphData.length > 1) {
    // Create gradient for the line
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#ffcc00');
    gradient.addColorStop(0.5, '#ffaa00');
    gradient.addColorStop(1, '#ff8800');

    // Draw glow effect
    ctx.shadowColor = '#ffcc00';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - (graphData[0] - 1) * yScale);

    for (let i = 1; i < graphData.length; i++) {
      const x = (i / graphData.length) * canvas.width;
      const y = canvas.height - (graphData[i] - 1) * yScale;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Reset shadow
    ctx.shadowBlur = 0;
  }

  // Draw multiplier labels with better visibility
  ctx.fillStyle = '#ffcc00';
  ctx.font = 'bold 12px Arial';
  ctx.shadowColor = '#000';
  ctx.shadowBlur = 2;
  
  const step = maxVal > 10 ? Math.ceil(maxVal / 5) : 1;
  for (let i = 1; i <= Math.floor(maxVal); i += step) {
    const y = canvas.height - (i - 1) * yScale;
    if (y > 10 && y < canvas.height) {
      ctx.fillText(i + 'x', 5, y + 5);
    }
  }
  ctx.shadowBlur = 0;

  // Draw current multiplier indicator
  if (graphData.length > 0) {
    const currentY = canvas.height - (graphData[graphData.length - 1] - 1) * yScale;
    const currentX = ((graphData.length - 1) / graphData.length) * canvas.width;

    ctx.save();
    ctx.translate(currentX, currentY);

    if (!gameRunning && currentMultiplier >= crashPoint) {
      // Explosão no Crash
      ctx.font = '40px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💥', 0, 0);
    } else {
      // Foguete voando
      // Calcula o ângulo baseado nos últimos pontos para suavizar
      let angle = -0.5; // Ângulo padrão
      if (graphData.length > 5) {
        const prevY = canvas.height - (graphData[graphData.length - 5] - 1) * yScale;
        const prevX = ((graphData.length - 5) / graphData.length) * canvas.width;
        angle = Math.atan2(currentY - prevY, currentX - prevX);
      }
      // Ajusta rotação (o emoji 🚀 aponta naturalmente para NE, ~45 graus)
      ctx.rotate(angle + Math.PI / 4);
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🚀', 0, 0);
    }
    ctx.restore();
  }
}

function updateMultiplier() {
  // Crescimento exponencial para criar a curva característica do Crash
  currentMultiplier = currentMultiplier * 1.008 + 0.001;
  multiplierDisplay.textContent = currentMultiplier.toFixed(2) + 'x';
  graphData.push(currentMultiplier);

  if (graphData.length > 200) {
    graphData.shift();
  }

  drawGraph();

  if (currentMultiplier >= crashPoint) {
    crash();
  }
}

function startCrash() {
  let chips = window.getChips();
  if (chips <= 0) return alert('Você não tem fichas suficientes para apostar!');
  crashBet = Number(document.getElementById('crashBet').value);
  if (crashBet > chips || crashBet <= 0) return alert('Aposta inválida!');

  chips -= crashBet;
  window.setChips(chips);

  currentMultiplier = 1.00;
  gameRunning = true;
  graphData = [1.00];

  // Generate crash point (between 1.01 and 10.00, with higher probability for lower values - more risky)
  const random = Math.random();
  if (random < 0.6) {
    crashPoint = 1.01 + Math.random() * 1.49; // 60% chance for 1.01-2.50 (very risky)
  } else if (random < 0.85) {
    crashPoint = 2.51 + Math.random() * 2.49; // 25% chance for 2.51-5.00
  } else {
    crashPoint = 5.01 + Math.random() * 4.99; // 15% chance for 5.01-10.00 (rare big wins)
  }

  multiplierDisplay.textContent = '1.00x';
  crashResult.textContent = 'Jogo em andamento...';
  document.getElementById('startCrash').disabled = true;
  document.getElementById('cashOut').disabled = false;

  gameInterval = setInterval(updateMultiplier, 100);
}

function cashOut() {
  if (!gameRunning) return;

  clearInterval(gameInterval);
  gameRunning = false;

  const winnings = Math.floor(crashBet * currentMultiplier);
  let chips = window.getChips() + winnings;
  window.setChips(chips);

  crashResult.textContent = `Você sacou em ${currentMultiplier.toFixed(2)}x! Ganhou ${winnings} fichas!`;
  document.getElementById('startCrash').disabled = false;
  document.getElementById('cashOut').disabled = true;

  addToHistory(`Sacou em ${currentMultiplier.toFixed(2)}x (+${winnings})`, 'cashed-out');

  // if (winnings > crashBet) {
  //   winSound.play(); // Removido para funcionar offline
  // }
}

function crash() {
  clearInterval(gameInterval);
  gameRunning = false;

  multiplierDisplay.textContent = 'CRASH!';
  multiplierDisplay.style.color = '#ff4444';
  crashResult.textContent = `Crashed em ${currentMultiplier.toFixed(2)}x! Você perdeu ${crashBet} fichas.`;

  setTimeout(() => {
    multiplierDisplay.textContent = '1.00x';
    multiplierDisplay.style.color = '#ffcc00';
  }, 2000);

  document.getElementById('startCrash').disabled = false;
  document.getElementById('cashOut').disabled = true;

  drawGraph(); // Desenha a explosão final
  addToHistory(`Crashed em ${currentMultiplier.toFixed(2)}x (-${crashBet})`, 'crashed');
}

function addToHistory(text, className) {
  history.unshift(text);
  if (history.length > 10) {
    history.pop();
  }

  historyList.innerHTML = '';
  history.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    li.className = className;
    historyList.appendChild(li);
  });
}

document.getElementById('startCrash').addEventListener('click', startCrash);
document.getElementById('cashOut').addEventListener('click', cashOut);

// Initialize canvas
initCanvas();
drawGraph();
