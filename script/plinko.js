// Plinko Game Logic
class PlinkoGame {
  constructor() {
    this.ball = document.getElementById('ball');
    this.board = document.getElementById('plinko-board');
    this.slots = Array.from(document.querySelectorAll('.plinko-slot')); // manter a ordem do HTML
    this.dropBtn = document.getElementById('dropBallBtn');
    this.betInput = document.getElementById('plinkoBet');
    this.resultDiv = document.getElementById('plinkoResult');
    this.chips = parseInt(document.getElementById('chips').textContent) || 1000;

    this.pinRadius = 8;
    this.ballRadius = 9;
    this.gravity = 0.4;
    this.friction = 0.95;
    this.bounce = 0.7;

    // inverter array de multiplicadores para corresponder à posição visual dos slots
    this.slotMultipliers = [7, 5, 3, 1.5, 1, 0.5, 0.3, 0.1].reverse(); // [0.1,0.3,0.5,1,1.5,3,5,7]

    this.isAnimating = false;
    this.currentBet = 0;

    this.init();
  }

  init() {
    this.dropBtn.addEventListener('click', () => this.dropBall());
    this.updateChipsDisplay();
  }

  updateChipsDisplay() {
    const chipsDisplay = document.getElementById('chips');
    if (chipsDisplay) this.chips = parseInt(chipsDisplay.textContent) || 1000;
  }

  dropBall() {
    if (this.isAnimating) return;

    this.updateChipsDisplay();
    const bet = parseInt(this.betInput.value) || 0;

    if (bet <= 0) {
      this.showResult('Digite uma aposta válida!', 'error');
      return;
    }

    if (bet > this.chips) {
      this.showResult('Fichas insuficientes!', 'error');
      return;
    }

    this.chips -= bet;
    this.currentBet = bet;
    document.getElementById('chips').textContent = this.chips;

    this.isAnimating = true;
    this.ball.classList.add('dropping');
    this.showResult('Bola caindo...', 'info');

    this.animateBall();
  }

  animateBall() {
    const boardRect = this.board.getBoundingClientRect();
    let ballX = boardRect.width / 2 - this.ballRadius;
    let ballY = 15;
    let velocityX = (Math.random() - 0.5) * 10;
    let velocityY = 0;

    const animate = () => {
      if (!this.isAnimating) return;

      velocityY += this.gravity;
      velocityX += (Math.random() - 0.5) * 1; // nudges aleatórios
      ballX += velocityX;
      ballY += velocityY;

      const newVelocities = this.checkPinCollisions(ballX + this.ballRadius, ballY + this.ballRadius, velocityX, velocityY);
      velocityX = newVelocities.velocityX;
      velocityY = newVelocities.velocityY;

      velocityX *= this.friction;
      velocityY *= this.friction;

      if (ballX <= 0 || ballX >= boardRect.width - this.ballRadius * 2) {
        velocityX *= -this.bounce;
        ballX = Math.max(0, Math.min(ballX, boardRect.width - this.ballRadius * 2));
      }

      if (ballY >= boardRect.height - 60) {
        this.landInSlot(ballX);
        return;
      }

      this.ball.style.left = ballX + 'px';
      this.ball.style.top = ballY + 'px';

      requestAnimationFrame(animate);
    };

    animate();
  }

  checkPinCollisions(ballX, ballY, velocityX, velocityY) {
    const pins = document.querySelectorAll('.pin');
    const boardRect = this.board.getBoundingClientRect();

    pins.forEach(pin => {
      const pinRect = pin.getBoundingClientRect();
      const pinCenterX = pinRect.left - boardRect.left + pinRect.width / 2;
      const pinCenterY = pinRect.top - boardRect.top + pinRect.height / 2;

      const distance = Math.hypot(ballX - pinCenterX, ballY - pinCenterY);

      if (distance < this.ballRadius + this.pinRadius) {
        const angle = Math.atan2(ballY - pinCenterY, ballX - pinCenterX);
        const force = 1;
        velocityX = Math.cos(angle) * force * (0.8 + Math.random() * 0.4);
        velocityY = Math.sin(angle) * force * (0.8 + Math.random() * 0.4);
      }
    });

    return { velocityX, velocityY };
  }

  landInSlot(ballX) {
    const boardRect = this.board.getBoundingClientRect();
    const slotWidth = boardRect.width / this.slotMultipliers.length;

    let relativeBallX = ballX;
    const randomOffset = (Math.random() - 0.5) * 5; // ±2.5px
    let slotIndex = Math.floor((relativeBallX + randomOffset) / slotWidth);
    slotIndex = Math.max(0, Math.min(slotIndex, this.slotMultipliers.length - 1));

    const multiplier = this.slotMultipliers[slotIndex];
    const winnings = this.currentBet * multiplier;

    this.chips += winnings;
    document.getElementById('chips').textContent = this.chips;

    const slotElement = this.slots[slotIndex];
    if (slotElement) {
      slotElement.style.animation = 'slotHighlight 0.5s ease-in-out';
      setTimeout(() => { slotElement.style.animation = ''; }, 500);
    }

    this.showResult(`${multiplier}x! Ganhou ${winnings.toFixed(2)} fichas!`, winnings > 0 ? 'success' : 'neutral');

    setTimeout(() => {
      this.ball.style.left = (boardRect.width / 2 - this.ballRadius) + 'px';
      this.ball.style.top = '15px';
      this.ball.classList.remove('dropping');
      this.isAnimating = false;
    }, 1000);
  }

  showResult(message, type = 'neutral') {
    this.resultDiv.textContent = message;
    this.resultDiv.className = '';

    if (type === 'success') {
      this.resultDiv.classList.add('success');
    } else if (type === 'error') {
      this.resultDiv.style.color = '#ff4444';
    } else if (type === 'info') {
      this.resultDiv.style.color = '#ffaa44';
    }
  }
}

// Inicializa o Plinko
document.addEventListener('DOMContentLoaded', () => {
  new PlinkoGame();
});

// Animação do slot
const style = document.createElement('style');
style.textContent = `
@keyframes slotHighlight {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
`;
document.head.appendChild(style);
