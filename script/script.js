  let chips = 1000;
document.getElementById('chips').textContent = chips;

// Sons removidos para funcionar offline
const spinSound = null;
const winSound = null;

// -------------------- ROLET
const wheelNumbers = Array.from({length:37},(_,i)=>i);
const wheelNumbersDiv = document.getElementById('wheelNumbers');
wheelNumbers.forEach((num, index) => {
  const span = document.createElement('span');
  span.textContent = num;
  span.className = 'number';
  if (num === 0) span.classList.add('green');
  else if (num % 2 === 0) span.classList.add('black');
  else span.classList.add('red');
  span.style.transform = `rotate(${index * 9.73}deg) translateY(-135px)`;
  wheelNumbersDiv.appendChild(span);
});
document.getElementById('spinRoulette').addEventListener('click', ()=>{
  if(chips <= 0) return alert('Você não tem fichas suficientes para apostar!');
  let bet = Number(document.getElementById('rouletteBet').value);
  let chosenNumber = Number(document.getElementById('rouletteNumber').value);
  if(bet>chips||bet<=0) return alert('Aposta inválida!');
  if(isNaN(chosenNumber) || chosenNumber < 0 || chosenNumber > 36) return alert('Número inválido!');
  // spinSound.play(); // Removido para funcionar offline
  const result = Math.floor(Math.random()*37);
  const rotation = 720 - result*9.73; // rotação animada
  const wheel = document.getElementById('wheelNumbers');
  wheel.style.transition='transform 3s ease-out';
  wheel.style.transform=`rotate(${rotation}deg)`;
  setTimeout(()=>{
    const win = (result === chosenNumber) ? bet * 10 : 0;
    // if(win) winSound.play(); // Removido para funcionar offline
    chips = chips - bet + win;
    document.getElementById('chips').textContent=chips;
    document.getElementById('rouletteResult').textContent=`Número sorteado: ${result} | Seu número: ${chosenNumber} | ${win ? 'Você ganhou!' : 'Perdeu!'}`;
  },3000);
});

// -------------------- SLOT MACHINE
const emojis = ['🍒','🍋','🍊','🍉','⭐','7️⃣'];
document.getElementById('spinSlot').addEventListener('click',()=>{
  if(chips <= 0) return alert('Você não tem fichas suficientes para apostar!');
  let bet = Number(document.getElementById('slotBet').value);
  if(bet>chips||bet<=0) return alert('Aposta inválida!');
  // spinSound.play(); // Removido para funcionar offline
  const slot1 = document.getElementById('slot1');
  const slot2 = document.getElementById('slot2');
  const slot3 = document.getElementById('slot3');
  let spins=20,count=0,final1,final2,final3;
  const interval=setInterval(()=>{
    slot1.textContent=emojis[Math.floor(Math.random()*emojis.length)];
    slot2.textContent=emojis[Math.floor(Math.random()*emojis.length)];
    slot3.textContent=emojis[Math.floor(Math.random()*emojis.length)];
    if(count === spins-1){
      final1 = slot1.textContent;
      final2 = slot2.textContent;
      final3 = slot3.textContent;
    }
    count++;
    if(count>=spins){
      clearInterval(interval);
      let win = 0;
      if(final1 === final2 && final2 === final3) win = bet * 5;
      else if(final1 === final2 || final1 === final3 || final2 === final3) win = bet * 2;
      // if(win) winSound.play(); // Removido para funcionar offline
      chips=chips-bet+win;
      document.getElementById('chips').textContent=chips;
      document.getElementById('slotResult').textContent=win?`🎉 Ganhou ${win} fichas!`:'Tente novamente!';
    }
  },100);
});

// -------------------- DADOS
const diceImages = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Alea_1.png/60px-Alea_1.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Alea_2.png/60px-Alea_2.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Alea_3.png/60px-Alea_3.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Alea_4.png/60px-Alea_4.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Alea_5.png/60px-Alea_5.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Alea_6.png/60px-Alea_6.png'
];
document.getElementById('rollDice').addEventListener('click',()=>{
  if(chips <= 0) return alert('Você não tem fichas suficientes para apostar!');
  let bet=Number(document.getElementById('diceBet').value);
  const chosenSum=Number(document.getElementById('diceSumChoice').value);
  if(bet>chips||bet<=0) return alert('Aposta inválida!');
  if(isNaN(chosenSum) || chosenSum < 2 || chosenSum > 12) return alert('Soma inválida! Escolha entre 2 e 12.');
  // spinSound.play(); // Removido para funcionar offline
  const die1 = document.getElementById('die1');
  const die2 = document.getElementById('die2');
  die1.classList.add('spin');
  die2.classList.add('spin');
  setTimeout(()=>{
    const dice1=Math.floor(Math.random()*6)+1;
    const dice2=Math.floor(Math.random()*6)+1;
    die1.src = diceImages[dice1 - 1];
    die2.src = diceImages[dice2 - 1];
    die1.classList.remove('spin');
    die2.classList.remove('spin');
    const total=dice1+dice2;
    const win=total===chosenSum?bet*5:0;
    // if(win) winSound.play(); // Removido para funcionar offline
    chips=chips-bet+win;
    document.getElementById('chips').textContent=chips;
    document.getElementById('diceResult').textContent=`Você rolou: ${dice1} e ${dice2} | Total: ${total} | Sua escolha: ${chosenSum} | ${win?'Ganhou!':'Perdeu!'}`;
  },1000);
});

// -------------------- BLACKJACK
let playerCards=[],dealerCards=[],playerTotal=0,dealerTotal=0,blackjackBet=0;
document.getElementById('startBlackjack').addEventListener('click',()=>{
  if(chips <= 0) return alert('Você não tem fichas suficientes para apostar!');
  blackjackBet=Number(document.getElementById('blackjackBet').value);
  if(blackjackBet>chips||blackjackBet<=0) return alert('Aposta inválida!');
  playerCards=[drawCard(),drawCard()];
  dealerCards=[drawCard(),drawCard()];
  playerTotal=sumCards(playerCards);
  dealerTotal=sumCards(dealerCards);
  document.getElementById('blackjackArea').style.display='block';
  updateBlackjackUI();
});
document.getElementById('hit').addEventListener('click',()=>{
  playerCards.push(drawCard());
  playerTotal=sumCards(playerCards);
  if(playerTotal>21){
    chips-=blackjackBet;
    endBlackjack('Você estourou! Perdeu!');
  } else updateBlackjackUI();
});
document.getElementById('stand').addEventListener('click',()=>{
  while(dealerTotal<17){
    dealerCards.push(drawCard());
    dealerTotal=sumCards(dealerCards);
  }
  if(dealerTotal>21||playerTotal>dealerTotal){
    chips+=blackjackBet;
    endBlackjack('Você ganhou!');
  } else if(playerTotal===dealerTotal){
    endBlackjack('Empate!');
  } else {
    chips-=blackjackBet;
    endBlackjack('Dealer venceu! Você perdeu!');
  }
});
function drawCard(){
  const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  const suits = ['♠','♥','♦','♣'];
  const rank = ranks[Math.floor(Math.random()*ranks.length)];
  const suit = suits[Math.floor(Math.random()*suits.length)];
  const value = rank === 'A' ? 11 : rank === 'J' || rank === 'Q' || rank === 'K' ? 10 : parseInt(rank);
  return {rank, suit, value, emoji: rank + suit};
}
function sumCards(cards){let total=cards.reduce((a,b)=>a+b.value,0);let aces=cards.filter(c=>c.rank==='A').length;while(total>21 && aces>0){total-=10;aces--;}return total;}
function updateBlackjackUI(){
  document.getElementById('playerCards').textContent=playerCards.map(c=>c.emoji).join(' ');
  document.getElementById('playerTotal').textContent=playerTotal;
  document.getElementById('dealerCards').textContent=dealerCards.map(c=>c.emoji).join(' ');
  document.getElementById('dealerTotal').textContent=dealerTotal;
}
function endBlackjack(msg){
  document.getElementById('blackjackResult').textContent=msg;
  document.getElementById('chips').textContent=chips;
  document.getElementById('blackjackArea').style.display='none';
}

 // -------------------- CARA OU COROA
document.getElementById('flipCoin').addEventListener('click',()=>{
  if(chips <= 0) return alert('Você não tem fichas suficientes para apostar!');
  let bet=Number(document.getElementById('coinBet').value);
  const choice=document.getElementById('coinChoice').value;
  if(bet>chips||bet<=0) return alert('Aposta inválida!');
  // spinSound.play(); // Removido para funcionar offline
  const coin = document.getElementById('coin');
  coin.classList.add('flip');
  setTimeout(()=>{
    const outcome=Math.random()<0.5?'cara':'coroa';
    if(outcome === 'cara'){
      coin.src = 'img/cara.jpg';
    } else {
      coin.src = 'img/coroa.jpg';
    }
    coin.classList.remove('flip');
    const win=choice===outcome?bet*2:0;
    // if(win) winSound.play(); // Removido para funcionar offline
    chips=chips-bet+win;
    document.getElementById('chips').textContent=chips;
    document.getElementById('coinResult').textContent=`Saiu ${outcome.toUpperCase()} | ${win?'Ganhou!':'Perdeu!'}`;
  },1000);
});

// -------------------- POKER SIMPLIFICADO
document.getElementById('dealPoker').addEventListener('click',()=>{
  if(chips <= 0) return alert('Você não tem fichas suficientes para apostar!');
  let bet=Number(document.getElementById('pokerBet').value);
  if(bet>chips||bet<=0) return alert('Aposta inválida!');
  // spinSound.play(); // Removido para funcionar offline
  const pokerCardsDiv = document.getElementById('pokerCards');
  pokerCardsDiv.innerHTML = '';
  const playerCards = [];
  const dealerCards = [];
  for(let i=0; i<5; i++){
    playerCards.push(drawCard());
    dealerCards.push(drawCard());
  }
  pokerCardsDiv.innerHTML = 'Suas cartas: ' + playerCards.map(c=>c.emoji).join(' ') + '<br>Dealer: ' + dealerCards.map(c=>c.emoji).join(' ');
  const hands=['Par','Dois Pares','Trinca','Full House','Sequência','Flush','Quadra','Straight Flush','Royal Flush'];
  const playerHand=hands[Math.floor(Math.random()*hands.length)];
  const dealerHand=hands[Math.floor(Math.random()*hands.length)];
  let win=0;
  if(hands.indexOf(playerHand)>hands.indexOf(dealerHand)) win=bet*3;
  else if(playerHand===dealerHand) win=bet;
  // if(win) winSound.play(); // Removido para funcionar offline
  chips=chips-bet+win;
  document.getElementById('chips').textContent=chips;
  document.getElementById('pokerResult').textContent=`Você: ${playerHand} | Dealer: ${dealerHand} | ${win?'Ganhou!':'Perdeu!'}`;
});

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

  // Draw grid with gradient effect
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 10; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * 20);
    ctx.lineTo(canvas.width, i * 20);
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
    ctx.moveTo(0, canvas.height - (graphData[0] - 1) * 20);

    for (let i = 1; i < graphData.length; i++) {
      const x = (i / graphData.length) * canvas.width;
      const y = canvas.height - (graphData[i] - 1) * 20;
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
  for (let i = 1; i <= 10; i++) {
    ctx.fillText(i + 'x', 5, canvas.height - i * 20 + 5);
  }
  ctx.shadowBlur = 0;

  // Draw current multiplier indicator
  if (graphData.length > 0) {
    const currentY = canvas.height - (graphData[graphData.length - 1] - 1) * 20;
    const currentX = ((graphData.length - 1) / graphData.length) * canvas.width;

    // Draw indicator dot
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(currentX, currentY, 4, 0, 2 * Math.PI);
    ctx.fill();

    // Draw indicator line
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(currentX, currentY);
    ctx.lineTo(currentX, canvas.height);
    ctx.stroke();
  }
}

function updateMultiplier() {
  // Aumenta mais rápido a partir do 2x para criar mais emoção
  let increment = 0.01;
  if (currentMultiplier >= 2.0) {
    increment = 0.02; // Dobra a velocidade após 2x
  }
  if (currentMultiplier >= 5.0) {
    increment = 0.03; // Triplica a velocidade após 5x
  }

  currentMultiplier += increment;
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
  if (chips <= 0) return alert('Você não tem fichas suficientes para apostar!');
  crashBet = Number(document.getElementById('crashBet').value);
  if (crashBet > chips || crashBet <= 0) return alert('Aposta inválida!');

  chips -= crashBet;
  document.getElementById('chips').textContent = chips;

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
  chips += winnings;
  document.getElementById('chips').textContent = chips;

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
