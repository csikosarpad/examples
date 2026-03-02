const splitter = document.querySelector('.splitter');
const layout = document.querySelector('.main-layout');

let isDragging = false;

splitter.addEventListener('mousedown', () => {
  isDragging = true;
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const newWidth = e.clientX;
  layout.style.gridTemplateColumns = `${newWidth}px 5px 1fr`;
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});
