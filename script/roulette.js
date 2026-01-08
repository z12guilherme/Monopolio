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
  let chips = window.getChips();
  if(chips <= 0) return alert('Você não tem fichas suficientes para apostar!');
  let bet = Number(document.getElementById('rouletteBet').value);
  let chosenNumber = Number(document.getElementById('rouletteNumber').value);
  if(bet>chips||bet<=0) return alert('Aposta inválida!');
  if(isNaN(chosenNumber) || chosenNumber < 0 || chosenNumber > 36) return alert('Número inválido!');
  
  chips -= bet;
  window.setChips(chips);

  // spinSound.play(); // Removido para funcionar offline
  const result = Math.floor(Math.random()*37);
  const rotation = 720 - result*9.73; // rotação animada
  const wheel = document.getElementById('wheelNumbers');
  wheel.style.transition='transform 3s ease-out';
  wheel.style.transform=`rotate(${rotation}deg)`;
  setTimeout(()=>{
    const win = (result === chosenNumber) ? bet * 36 : 0;
    // if(win) winSound.play(); // Removido para funcionar offline
    if (win > 0) {
      chips += win;
      window.setChips(chips);
    }
    document.getElementById('rouletteResult').textContent=`Número sorteado: ${result} | Seu número: ${chosenNumber} | ${win ? 'Você ganhou!' : 'Perdeu!'}`;
  },3000);
});