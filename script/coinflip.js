// -------------------- CARA OU COROA
document.getElementById('flipCoin').addEventListener('click',()=>{
  let chips = window.getChips();
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
    window.setChips(chips);
    document.getElementById('coinResult').textContent=`Saiu ${outcome.toUpperCase()} | ${win?'Ganhou!':'Perdeu!'}`;
  },1000);
});
