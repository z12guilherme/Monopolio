// Mines Game Logic - Complete Implementation
(function() {

let minesBet = 0;
let minesCount = 5;
let minesBoard = [];
let minesRevealed = [];
let minesMultiplier = 1.00;
let minesGemsFound = 0;
let minesGameActive = false;
let minesCashOutAvailable = false;
let minesTotalGems = 0;

// Multiplier table based on mines count and gems found
// Higher risk (more mines) = higher multipliers
// Much more aggressive multipliers for better excitement
const multiplierTable = {
  3: [1.00, 1.10, 1.25, 1.45, 1.70, 2.00, 2.35, 2.75, 3.25, 3.80, 4.45, 5.20, 6.10, 7.15, 8.35, 9.75, 11.40, 13.35, 15.60, 18.25, 21.35, 24.95],
  5: [1.00, 1.25, 1.55, 1.75, 1.90, 2.25, 2.65, 3.15, 3.75, 4.45, 5.25, 6.20, 7.35, 8.70, 10.30, 12.20, 14.45, 17.10, 20.25, 24.00],
  7: [1.00, 1.70, 1.95, 2.05, 2.10, 2.55, 3.05, 3.70, 4.45, 5.35, 6.45, 7.75, 9.35, 11.25, 13.55, 16.35, 19.70, 23.75],
  10: [1.00, 2.85, 3.70, 4.45, 5.60, 7.30, 8.20, 9.35, 10.80, 11.65, 12.80, 14.00, 17.85, 22.75, 29.00]
};

function initMinesGame() {
  // Initialize game state
  minesBoard = [];
  minesRevealed = [];
  minesMultiplier = 1.00;
  minesGemsFound = 0;
  minesGameActive = false;
  minesCashOutAvailable = false;
  minesTotalGems = 0;

  // Create 5x5 board (25 squares)
  for (let i = 0; i < 25; i++) {
    minesBoard.push('hidden');
    minesRevealed.push(false);
  }

  updateMinesUI();
}

function startMinesGame() {
  // Check if chips are available
  let chips = window.getChips();
  if (chips <= 0) {
    alert('Você não tem fichas suficientes para apostar!');
    return;
  }

  // Get bet amount and mines count
  minesBet = Number(document.getElementById('minesBet').value);
  minesCount = Number(document.getElementById('minesCount').value);

  // Validate bet
  if (minesBet > chips || minesBet <= 0) {
    alert('Aposta inválida!');
    return;
  }

  // Deduct bet from chips
  chips -= minesBet;
  window.setChips(chips);

  // Generate mines randomly
  const minePositions = [];
  while (minePositions.length < minesCount) {
    const pos = Math.floor(Math.random() * 25);
    if (!minePositions.includes(pos)) {
      minePositions.push(pos);
    }
  }

  // Set up board: mines and gems
  minesTotalGems = 25 - minesCount;
  for (let i = 0; i < 25; i++) {
    minesBoard[i] = minePositions.includes(i) ? 'mine' : 'gem';
    minesRevealed[i] = false;
  }

  // Reset game state
  minesMultiplier = 1.50;
  minesGemsFound = 0;
  minesGameActive = true;
  minesCashOutAvailable = false;

  updateMinesUI();
  document.getElementById('minesResult').textContent = '🎮 Jogo iniciado! Clique nos quadrados para revelar gemas. Evite as minas!';
}

function revealMinesCell(index) {
  if (!minesGameActive || minesRevealed[index]) {
    return;
  }

  minesRevealed[index] = true;

  if (minesBoard[index] === 'mine') {
    // Hit a mine - game over
    minesGameActive = false;
    minesCashOutAvailable = false;
    revealAllMines();
    document.getElementById('minesResult').textContent = `💥 Mina encontrada! Você perdeu ${minesBet} fichas.`;
    updateMinesUI();
    return;
  }

  // Found a gem
  minesGemsFound++;
  minesCashOutAvailable = true;

  // Calculate new multiplier
  if (minesGemsFound <= multiplierTable[minesCount].length) {
    minesMultiplier = multiplierTable[minesCount][minesGemsFound - 1];
  }

  updateMinesUI();

  // Check if all gems are found
  if (minesGemsFound === minesTotalGems) {
    cashOutMines(true);
  }
}

function revealAllMines() {
  for (let i = 0; i < 25; i++) {
    if (minesBoard[i] === 'mine') {
      minesRevealed[i] = true;
    }
  }
}

function cashOutMines(autoWin = false) {
  if (!minesGameActive && !autoWin) {
    return;
  }

  minesGameActive = false;
  minesCashOutAvailable = false;

  const winnings = Math.floor(minesBet * minesMultiplier);
  let chips = window.getChips() + winnings;
  window.setChips(chips);

  if (autoWin) {
    document.getElementById('minesResult').textContent = `🎉 Parabéns! Você encontrou todas as ${minesTotalGems} gemas e ganhou ${winnings} fichas!`;
  } else {
    document.getElementById('minesResult').textContent = `💰 Sacou com ${minesMultiplier.toFixed(2)}x! Ganhou ${winnings} fichas!`;
  }

  updateMinesUI();
}

function updateMinesUI() {
  // Update multiplier display
  document.getElementById('minesMultiplier').textContent = minesMultiplier.toFixed(2) + 'x';

  // Update gems counter
  document.getElementById('minesGems').textContent = `Gemas: ${minesGemsFound}/${minesTotalGems}`;

  // Update potential winnings
  const potential = Math.floor(minesBet * minesMultiplier);
  document.getElementById('minesPotential').textContent = `Potencial: ${potential} fichas`;

  // Update board
  const boardElement = document.getElementById('minesBoard');
  boardElement.innerHTML = '';

  for (let i = 0; i < 25; i++) {
    const cell = document.createElement('div');
    cell.className = 'mines-cell';

    if (minesRevealed[i]) {
      cell.classList.add('revealed');
      if (minesBoard[i] === 'gem') {
        cell.classList.add('gem');
        cell.textContent = '💎';
        cell.title = 'Gema encontrada!';
      } else if (minesBoard[i] === 'mine') {
        cell.classList.add('mine');
        cell.textContent = '💣';
        cell.title = 'Mina! Fim de jogo!';
      }
    } else {
      cell.classList.add('hidden');
      cell.textContent = '?';
      cell.title = 'Clique para revelar';
      if (minesGameActive) {
        cell.onclick = () => revealMinesCell(i);
        cell.style.cursor = 'pointer';
      } else {
        cell.style.cursor = 'not-allowed';
      }
    }

    boardElement.appendChild(cell);
  }

  // Update buttons
  const startButton = document.getElementById('startMines');
  const cashOutButton = document.getElementById('cashOutMines');

  if (minesGameActive) {
    startButton.disabled = true;
    cashOutButton.disabled = !minesCashOutAvailable;
  } else {
    startButton.disabled = false;
    cashOutButton.disabled = true;
  }
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    initMinesGame();

    // Add event listeners
    const startButton = document.getElementById('startMines');
    const cashOutButton = document.getElementById('cashOutMines');

    if (startButton) {
      startButton.addEventListener('click', startMinesGame);
    }
    if (cashOutButton) {
      cashOutButton.addEventListener('click', () => cashOutMines(false));
    }
  }, 100);
});

// Sistema Anti-Trapaça (Trap for cheaters)
Object.defineProperty(window, 'minesBoard', {
    get: function() {
        alert('Achou que seria fácil? Jogue limpo! 🤡🚫');
        return Array(25).fill('TENTE_OUTRA_VEZ');
    },
    set: function() {
        console.log('Tentativa de alteração bloqueada.');
    },
    configurable: true
});

})();
