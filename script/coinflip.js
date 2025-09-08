// -------------------- COIN FLIP ------------------- //

const coin = document.getElementById('coin');
const flipBtn = document.getElementById('flipCoin');
const coinResult = document.getElementById('coinResult');
const coinBetInput = document.getElementById('coinBet');
const coinChoiceSelect = document.getElementById('coinChoice');

let isFlipping = false;

function resetCoin() {
  coin.style.transition = 'none';
  coin.style.transform = 'rotateY(0deg)';
  coin.src = 'img/cara.png';
  coinResult.textContent = 'Resultado: -';
  isFlipping = false;
}

function flipCoin() {
  if (isFlipping) return;
  let chips = window.getChips();
  if (chips <= 0) return alert('Você não tem fichas suficientes para apostar!');
  let bet = Number(coinBetInput.value);
  if (bet <= 0 || bet > chips) return alert('Aposta inválida!');
  let choice = coinChoiceSelect.value;

  isFlipping = true;
  coinResult.textContent = 'Girando...';

  // Animate coin flip with multiple rotations
  let flips = 6 + Math.floor(Math.random() * 6); // 6 to 11 flips
  let duration = 2000; // 2 seconds

  coin.style.transition = `transform ${duration}ms ease-in-out`;
  coin.style.transform = `rotateY(${flips * 180}deg)`;

  setTimeout(() => {
    // Determine outcome
    let outcome = Math.random() < 0.5 ? 'cara' : 'coroa';
    coin.src = outcome === 'cara' ? 'img/cara.png' : 'img/coroa.png';

    if (choice === outcome) {
      let winnings = bet * 2;
      window.setChips(chips - bet + winnings);
      coinResult.textContent = `🎉 Você ganhou ${winnings} fichas!`;
    } else {
      window.setChips(chips - bet);
      coinResult.textContent = 'Você perdeu! Tente novamente.';
    }

    // Reset flip state after short delay
    setTimeout(() => {
      resetCoin();
    }, 1500);
  }, duration);
}

flipBtn.addEventListener('click', flipCoin);

// Initialize coin state on load
resetCoin();
