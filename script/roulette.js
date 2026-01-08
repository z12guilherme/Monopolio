// -------------------- ROLET
const wheelNumbers = Array.from({length:37},(_,i)=>i);
const wheelNumbersDiv = document.getElementById('wheelNumbers');
const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
let currentRotation = 0;
let isSpinning = false;

wheelNumbers.forEach((num, index) => {
  const span = document.createElement('span');
  span.textContent = num;
  span.className = 'number';
  if (num === 0) span.classList.add('green');
  else if (redNumbers.includes(num)) span.classList.add('red');
  else span.classList.add('black');
  span.style.transform = `rotate(${index * 9.73}deg) translateY(-135px)`;
  wheelNumbersDiv.appendChild(span);
});
document.getElementById('spinRoulette').addEventListener('click', ()=>{
  if (isSpinning) return alert('Aguarde a roleta parar!');
  let chips = window.getChips();
  if(chips <= 0) return alert('Você não tem fichas suficientes para apostar!');
  let bet = Number(document.getElementById('rouletteBet').value);
  let chosenNumber = Number(document.getElementById('rouletteNumber').value);
  if(bet>chips||bet<=0) return alert('Aposta inválida!');
  if(isNaN(chosenNumber) || chosenNumber < 0 || chosenNumber > 36) return alert('Número inválido!');
  
  chips -= bet;
  window.setChips(chips);
  isSpinning = true;

  // spinSound.play(); // Removido para funcionar offline
  const result = Math.floor(Math.random()*37);
  
  const segmentAngle = 360 / 37;
  const spins = 5;
  const targetAngle = (360 - (result * segmentAngle)) % 360;
  let distance = targetAngle - (currentRotation % 360);
  if (distance <= 0) distance += 360;
  currentRotation += distance + (spins * 360);

  const wheel = document.getElementById('wheelNumbers');
  wheel.style.transition='transform 3s ease-out';
  wheel.style.transform=`rotate(${currentRotation}deg)`;
  setTimeout(()=>{
    isSpinning = false;
    const win = (result === chosenNumber) ? bet * 36 : 0;
    // if(win) winSound.play(); // Removido para funcionar offline
    if (win > 0) {
      chips += win;
      window.setChips(chips);
    }
    document.getElementById('rouletteResult').textContent=`Número sorteado: ${result} | Seu número: ${chosenNumber} | ${win ? 'Você ganhou!' : 'Perdeu!'}`;
  },3000);
});