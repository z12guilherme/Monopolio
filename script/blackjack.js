// ...existing code...
// -------------------- BLACKJACK (corrigido)
let playerCards = [], dealerCards = [], playerTotal = 0, dealerTotal = 0, blackjackBet = 0;
let gameInProgress = false;
let showDealer = false;

const startBtn = document.getElementById('startBlackjack');
const hitBtn = document.getElementById('hit');
const standBtn = document.getElementById('stand');

function resetButtons() {
  if (hitBtn) hitBtn.disabled = true;
  if (standBtn) standBtn.disabled = true;
}
resetButtons();

startBtn.addEventListener('click', () => {
  if (gameInProgress) return;
  let chips = Number(window.getChips());
  if (!Number.isFinite(chips) || chips <= 0) return alert('Você não tem fichas suficientes para apostar!');
  blackjackBet = Number(document.getElementById('blackjackBet').value);
  if (!Number.isFinite(blackjackBet) || blackjackBet <= 0 || blackjackBet > chips) return alert('Aposta inválida!');

  // Deduz a aposta ao iniciar (evita múltiplas deduções)
  window.setChips(chips - blackjackBet);

  playerCards = [drawCard(), drawCard()];
  dealerCards = [drawCard(), drawCard()];
  playerTotal = sumCards(playerCards);
  dealerTotal = sumCards(dealerCards);

  gameInProgress = true;
  showDealer = false;
  document.getElementById('blackjackArea').style.display = 'block';
  hitBtn.disabled = false;
  standBtn.disabled = false;
  updateBlackjackUI();

  // Checar blackjacks imediatos
  if (playerTotal === 21 || dealerTotal === 21) {
    if (playerTotal === 21 && dealerTotal === 21) {
      // Push: devolve a aposta
      window.setChips(Number(window.getChips()) + blackjackBet);
      endBlackjack('Empate com Blackjack!');
    } else if (playerTotal === 21) {
      // Blackjack do jogador: paga 3:2 (como aposta já foi deduzida, adiciona 2.5 * aposta)
      window.setChips(Number(window.getChips()) + blackjackBet * 2.5);
      endBlackjack('Blackjack! Você ganhou!');
    } else {
      // Blackjack do dealer: aposta já perdida
      endBlackjack('Dealer tem Blackjack! Você perdeu!');
    }
  }
});

hitBtn.addEventListener('click', () => {
  if (!gameInProgress) return;
  playerCards.push(drawCard());
  playerTotal = sumCards(playerCards);
  if (playerTotal > 21) {
    // Já deduzimos a aposta no início
    showDealer = true;
    endBlackjack('Você estourou! Perdeu!');
  } else {
    updateBlackjackUI();
  }
});

standBtn.addEventListener('click', () => {
  if (!gameInProgress) return;
  dealerTotal = sumCards(dealerCards);
  while (dealerTotal < 17) {
    dealerCards.push(drawCard());
    dealerTotal = sumCards(dealerCards);
  }
  showDealer = true;

  let chips = Number(window.getChips());
  if (dealerTotal > 21 || playerTotal > dealerTotal) {
    // Vitória paga 1:1 -> como já deduzimos a aposta, adiciona 2 * aposta (aposta + ganho)
    window.setChips(chips + blackjackBet * 2);
    endBlackjack('Você ganhou!');
  } else if (playerTotal === dealerTotal) {
    // Push -> devolve a aposta
    window.setChips(chips + blackjackBet);
    endBlackjack('Empate!');
  } else {
    // Dealer venceu -> aposta já perdida (já deduzida)
    endBlackjack('Dealer venceu! Você perdeu!');
  }
});

function drawCard() {
  const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  const suits = ['♠','♥','♦','♣'];
  const rank = ranks[Math.floor(Math.random()*ranks.length)];
  const suit = suits[Math.floor(Math.random()*suits.length)];
  const value = rank === 'A' ? 11 : (rank === 'J' || rank === 'Q' || rank === 'K' ? 10 : parseInt(rank, 10));
  const color = (suit === '♥' || suit === '♦') ? 'red' : 'black';
  return { rank, suit, value, color, emoji: rank + suit };
}

function sumCards(cards) {
  let total = cards.reduce((a,b) => a + b.value, 0);
  let aces = cards.filter(c => c.rank === 'A').length;
  while (total > 21 && aces > 0) { total -= 10; aces--; }
  return total;
}

function updateBlackjackUI() {
  const playerCardsEl = document.getElementById('playerCards');
  const dealerCardsEl = document.getElementById('dealerCards');

  function cardHTML(card) {
    return `
      <span class="card ${card.color}">
        <span class="corner top-left">${card.rank}${card.suit}</span>
        <span class="corner bottom-right">${card.rank}${card.suit}</span>
        <span class="center-suit">${card.suit}</span>
      </span>
    `;
  }

  playerCardsEl.innerHTML = playerCards.map(cardHTML).join('');
  document.getElementById('playerTotal').textContent = playerTotal;

  if (showDealer) {
    dealerCardsEl.innerHTML = dealerCards.map(cardHTML).join('');
    document.getElementById('dealerTotal').textContent = dealerTotal;
  } else {
    const firstCard = dealerCards[0] ? cardHTML(dealerCards[0]) : '';
    const hiddenCard = dealerCards.length > 1 ? `<span class="card back">?</span>` : '';
    dealerCardsEl.innerHTML = firstCard + hiddenCard;
    document.getElementById('dealerTotal').textContent = '?';
  }
}

function endBlackjack(msg) {
  gameInProgress = false;
  showDealer = true;
  updateBlackjackUI();
  document.getElementById('blackjackResult').textContent = msg;
  if (hitBtn) hitBtn.disabled = true;
  if (standBtn) standBtn.disabled = true;
  // Mantém a área visível para o jogador ver o resultado.
}
// ...existing code...