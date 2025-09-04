// -------------------- SLOT MACHINE
const emojis = ['🍒','🍋','🍊','🍉','⭐','7️⃣'];
document.getElementById('spinSlot').addEventListener('click',()=>{
  let chips = window.getChips();
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
      window.setChips(chips);
      document.getElementById('slotResult').textContent=win?`🎉 Ganhou ${win} fichas!`:'Tente novamente!';
    }
  },100);
});
