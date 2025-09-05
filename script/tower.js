document.addEventListener('DOMContentLoaded', () => {
  const towerGame = document.getElementById('towerGame');
  const towerScore = document.getElementById('towerScore');
  const towerInstructions = document.getElementById('towerInstructions');
  const restartTowerBtn = document.getElementById('restartTower');
  const towerResult = document.getElementById('towerResult');
  const blocksContainer = document.getElementById('blocksContainer');
  const cashOutBtn = document.getElementById('towerCashOut');
  const towerCashOutAmount = document.getElementById('towerCashOutAmount');

  let betAmount = 0;
  let currentLevel = 0;
  let currentMultiplier = 1;
  let gameActive = false;

  function resetGame() {
    betAmount = 0;
    currentLevel = 0;
    currentMultiplier = 1;
    gameActive = false;
    towerResult.textContent = '';
    towerScore.textContent = `Multiplicador: 1.00x`;
    towerInstructions.textContent = 'Clique ou pressione ESPAÇO para soltar o bloco!';
    blocksContainer.innerHTML = '';
    cashOutBtn.disabled = true;
    towerCashOutAmount.textContent = '';
  }

  function drawBlock(level, status) {
    const block = document.createElement('div');
    block.classList.add('block');
    if (status === 'crash') {
      block.classList.add('crash');
    } else if (status === 'success') {
      block.classList.add('success');
    }
    block.textContent = `x${(currentMultiplier).toFixed(2)}`;
    blocksContainer.prepend(block);
  }

  function advanceLevel() {
    if (!gameActive) return;

    // Chance to crash increases with level
    const crashChance = Math.min(0.2 + currentLevel * 0.08, 0.9);
    if (Math.random() < crashChance) {
      gameActive = false;
      towerResult.textContent = 'Crash! Você perdeu a aposta.';
      towerResult.style.color = '#ff4444';
      drawBlock(currentLevel, 'crash');
      cashOutBtn.disabled = true;
      towerCashOutAmount.textContent = '';
      return;
    }

    currentLevel++;
    currentMultiplier *= 1.5; // Increase multiplier by 1.5x per level
    towerScore.textContent = `Multiplicador: ${currentMultiplier.toFixed(2)}x`;
    towerResult.textContent = '';
    drawBlock(currentLevel - 1, 'success');
    cashOutBtn.disabled = false;
    towerCashOutAmount.textContent = `Potencial: ${(betAmount * currentMultiplier).toFixed(2)} fichas`;
  }

  function cashOut() {
    if (!gameActive) return;
    const winnings = betAmount * currentMultiplier;
    towerResult.textContent = `Você sacou e ganhou ${winnings.toFixed(2)} fichas!`;
    towerResult.style.color = '#00cc00';
    let chips = window.getChips();
    chips += winnings;
    window.setChips(chips);
    const chipsDisplay = document.getElementById('chips');
    if (chipsDisplay) {
      chipsDisplay.textContent = chips.toFixed(2);
    }
    resetGame();
    towerCashOutAmount.textContent = `Você sacou ${winnings.toFixed(2)} fichas`;
  }

  restartTowerBtn.addEventListener('click', () => {
    const betInput = document.getElementById('towerBet');
    const betNum = Number(betInput.value);
    if (isNaN(betNum) || betNum <= 0) {
      alert('Aposta inválida!');
      return;
    }
    let chips = window.getChips();
    if (chips < betNum) {
      alert('Você não tem fichas suficientes!');
      return;
    }
    chips -= betNum;
    window.setChips(chips);
    betAmount = betNum;
    currentLevel = 0;
    currentMultiplier = 1;
    gameActive = true;
    towerResult.textContent = '';
    towerScore.textContent = `Multiplicador: 1.00x`;
    towerInstructions.textContent = 'Clique ou pressione ESPAÇO para soltar o bloco!';
    blocksContainer.innerHTML = '';
    cashOutBtn.disabled = true;
    towerCashOutAmount.textContent = `Potencial: ${(betAmount * currentMultiplier).toFixed(2)} fichas`;
  });

  cashOutBtn.addEventListener('click', () => {
    cashOut();
  });

  document.addEventListener('keydown', (e) => {
    if (!gameActive) return;
    if (e.code === 'Space') {
      e.preventDefault();
      advanceLevel();
    }
  });

  blocksContainer.addEventListener('click', () => {
    if (!gameActive) return;
    advanceLevel();
  });

  resetGame();
});
