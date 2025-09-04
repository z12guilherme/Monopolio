// -------------------- BLACKJACK
let playerCards=[],dealerCards=[],playerTotal=0,dealerTotal=0,blackjackBet=0;
document.getElementById('startBlackjack').addEventListener('click',()=>{
  let chips = window.getChips();
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
    let chips = window.getChips() - blackjackBet;
    window.setChips(chips);
    endBlackjack('Você estourou! Perdeu!');
  } else updateBlackjackUI();
});
document.getElementById('stand').addEventListener('click',()=>{
  while(dealerTotal<17){
    dealerCards.push(drawCard());
    dealerTotal=sumCards(dealerCards);
  }
  let chips = window.getChips();
  if(dealerTotal>21||playerTotal>dealerTotal){
    chips += blackjackBet;
    window.setChips(chips);
    endBlackjack('Você ganhou!');
  } else if(playerTotal===dealerTotal){
    endBlackjack('Empate!');
  } else {
    chips -= blackjackBet;
    window.setChips(chips);
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
  document.getElementById('blackjackArea').style.display='none';
}
