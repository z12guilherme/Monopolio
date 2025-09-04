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
  let chips = window.getChips();
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
    window.setChips(chips);
    document.getElementById('diceResult').textContent=`Você rolou: ${dice1} e ${dice2} | Total: ${total} | Sua escolha: ${chosenSum} | ${win?'Ganhou!':'Perdeu!'}`;
  },1000);
});
