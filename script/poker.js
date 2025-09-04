function drawCard(){
  const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  const suits = ['♠','♥','♦','♣'];
  const rank = ranks[Math.floor(Math.random()*ranks.length)];
  const suit = suits[Math.floor(Math.random()*suits.length)];
  const value = rank === 'A' ? 11 : rank === 'J' || rank === 'Q' || rank === 'K' ? 10 : parseInt(rank);
  return {rank, suit, value, emoji: rank + suit};
}

// -------------------- POKER SIMPLIFICADO
document.getElementById('dealPoker').addEventListener('click',()=>{
  let chips = window.getChips();
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
  window.setChips(chips);
  document.getElementById('pokerResult').textContent=`Você: ${playerHand} | Dealer: ${dealerHand} | ${win?'Ganhou!':'Perdeu!'}`;
});
