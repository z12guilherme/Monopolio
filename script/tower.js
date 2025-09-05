document.addEventListener('DOMContentLoaded', () => {
  const towerGame = document.getElementById('towerGame');
  const towerScore = document.getElementById('towerScore');
  const towerCanvas = document.getElementById('towerCanvas');
  const towerInstructions = document.getElementById('towerInstructions');
  const restartTowerBtn = document.getElementById('restartTower');
  const towerResult = document.getElementById('towerResult');

  const ctx = towerCanvas.getContext('2d');
  const canvasWidth = towerCanvas.width;
  const canvasHeight = towerCanvas.height;

  let currentLevel = 0;
  let betAmount = 0;
  let currentWinnings = 1;
  let multipliers = [];
  let crashChance = (level) => Math.min(0.2 + level * 0.08, 0.9);
  let gameActive = false;

  function initMultipliers() {
    multipliers = [];
    for (let i = 1; i <= 20; i++) {
      multipliers.push(1 + i * 0.5);
    }
  }

  function resetGame() {
    currentLevel = 0;
    currentWinnings = 1;
    betAmount = 0;
    gameActive = false;
    towerResult.textContent = '';
    towerScore.textContent = 'Pontuação: 0';
    towerInstructions.textContent = 'Clique ou pressione ESPAÇO para soltar o bloco!';
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  }

  function drawBlock(level, color) {
    const blockHeight = 30;
    const blockWidth = canvasWidth - 40;
    const x = 20;
    const y = canvasHeight - (level + 1) * (blockHeight + 5);

    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockWidth, blockHeight);

    ctx.fillStyle = '#111';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`x${multipliers[level].toFixed(2)}`, canvasWidth / 2, y + blockHeight / 2 + 6);
  }

  function drawTower() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (let i = 0; i < currentLevel; i++) {
      drawBlock(i, '#ffaa00');
    }
    if (gameActive) {
      drawBlock(currentLevel, '#4ecdc4');
    }
  }

  function advanceLevel() {
    if (!gameActive) return;

    if (Math.random() < crashChance(currentLevel)) {
      gameActive = false;
      towerResult.textContent = 'Crash! Você perdeu a aposta.';
      towerResult.style.color = '#ff4444';
      drawBlock(currentLevel, '#ff4444');
      return;
    }

    currentWinnings *= multipliers[currentLevel];
    currentLevel++;
    towerScore.textContent = `Pontuação: ${currentWinnings.toFixed(2)}`;
    drawTower();
  }

  function cashOut() {
    if (!gameActive) return;
    const winnings = (betAmount * currentWinnings);
    // Show message below the game instead of alert popup
    towerResult.textContent = `Você sacou e ganhou ${winnings.toFixed(2)} fichas!`;
    towerResult.style.color = '#00cc00';
    // Update chips balance here
    let chips = window.getChips();
    chips += winnings;
    window.setChips(chips);
    // Show total chips after cash out
    const chipsDisplay = document.getElementById('chips');
    if (chipsDisplay) {
      chipsDisplay.textContent = chips.toFixed(2);
    }
    // Show amount cashed out on tower screen
    const cashOutAmountDisplay = document.getElementById('towerCashOutAmount');
    if (cashOutAmountDisplay) {
      cashOutAmountDisplay.textContent = `Valor sacado: ${winnings.toFixed(2)} fichas`;
      cashOutAmountDisplay.style.color = '#00cc00';
    }
    resetGame();
  }

  // Add cash out button dynamically
  const cashOutBtn = document.createElement('button');
  cashOutBtn.textContent = 'Sacar';
  cashOutBtn.style.margin = '10px';
  cashOutBtn.disabled = true;
  towerGame.appendChild(cashOutBtn);

  cashOutBtn.addEventListener('click', () => {
    if (!gameActive) return;
    cashOut();
    cashOutBtn.disabled = true;
  });

  // Enable cash out button when game is active
  function updateCashOutButton() {
    cashOutBtn.disabled = !gameActive;
  }

  // Modify advanceLevel to update cash out button state
  const originalAdvanceLevel = advanceLevel;
  advanceLevel = function() {
    originalAdvanceLevel();
    updateCashOutButton();
  };

  // Modify restart button handler to update cash out button state
  const originalRestartHandler = restartTowerBtn.onclick;
  restartTowerBtn.onclick = function(event) {
    if (originalRestartHandler) originalRestartHandler(event);
    updateCashOutButton();
  };

  towerCanvas.addEventListener('click', () => {
    if (!gameActive) return;
    advanceLevel();
  });

  document.addEventListener('keydown', (e) => {
    if (!gameActive) return;
    if (e.code === 'Space') {
      e.preventDefault();
      advanceLevel();
    }
  });

  restartTowerBtn.addEventListener('click', () => {
    const betInput = document.getElementById('towerBet');
    const betNum = Number(betInput.value);
    if (isNaN(betNum) || betNum <= 0) {
      alert('Aposta inválida!');
      return;
    }
    betAmount = betNum;
    currentLevel = 0;
    currentWinnings = 1;
    gameActive = true;
    towerResult.textContent = '';
    towerScore.textContent = 'Pontuação: 0';
    initMultipliers();
    drawTower();
  });

  initMultipliers();
  resetGame();
});
