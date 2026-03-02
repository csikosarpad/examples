const animateBtn = document.querySelector('#animate-btn');
const piechart = document.querySelector('.piechart');
animateBtn.addEventListener('click', () => {
  animateBtn.textContent =
    animateBtn.textContent === 'Animate' ? 'Stop animation' : 'Animate';
  piechart.classList.toggle('animated');
});

document.querySelector('#randomize-btn').addEventListener('click', () => {
  const randomValue = Math.floor(Math.random() * 100);
  piechart.style.background = `conic-gradient(
    rgb(59, 130, 246) 0%,
    rgb(59, 130, 246) ${randomValue}%,
    rgb(6, 182, 212) ${randomValue}%,
    rgb(6, 182, 212) ${randomValue + 15}%,
    rgb(52, 211, 153) ${randomValue + 15}%,
    rgb(52, 211, 153) ${randomValue + 30}%,
    rgb(251, 191, 36) ${randomValue + 30}%,
    rgb(251, 191, 36) ${randomValue + 40}%,
    rgb(251, 113, 133) ${randomValue + 40}%,
    rgb(251, 113, 133) ${randomValue + 50}%
    )`;
});
