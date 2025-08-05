document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.hoenn-exhibit');
  if (!container) return;

  const sprites = Array.from(container.getElementsByTagName('img'));
  const spriteSize = 96;

  // === Editable Settings ===
  const speedMultiplier = 0.3;  // Lower is slower
  const bounceHeight = 20;      // How high they jump on click
  const visiblePadding = 50;    // How far they can go "offscreen"
  // =========================

  const state = sprites.map(img => ({
    x: Math.random() * (container.clientWidth - spriteSize),
    y: Math.random() * (container.clientHeight - spriteSize),
    dx: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? 1 : -1) * speedMultiplier,
    dy: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? 1 : -1) * speedMultiplier,
    paused: false,
  }));

  sprites.forEach((img, i) => {
    img.style.left = state[i].x + 'px';
    img.style.top = state[i].y + 'px';

    img.addEventListener('mouseenter', () => {
      state[i].paused = true;
      img.style.zIndex = 1;
    });

    img.addEventListener('mouseleave', () => {
      state[i].paused = false;
      img.style.zIndex = 0;
    });

    img.addEventListener('click', () => {
      img.classList.remove('pkmnclicked');
      void img.offsetWidth;
      img.classList.add('pkmnclicked');
    });
  });

  function animate() {
    const bounds = container.getBoundingClientRect();
    const maxX = bounds.width + visiblePadding;
    const maxY = bounds.height + visiblePadding;
    const min = -visiblePadding;

    sprites.forEach((img, i) => {
      if (state[i].paused) return;

      state[i].x += state[i].dx;
      state[i].y += state[i].dy;

      if (state[i].x <= min || state[i].x >= maxX - spriteSize) state[i].dx *= -1;
      if (state[i].y <= min || state[i].y >= maxY - spriteSize) state[i].dy *= -1;

      state[i].x = Math.max(min, Math.min(maxX - spriteSize, state[i].x));
      state[i].y = Math.max(min, Math.min(maxY - spriteSize, state[i].y));

      img.style.left = state[i].x + 'px';
      img.style.top = state[i].y + 'px';
    });

    requestAnimationFrame(animate);
  }

  animate();
});


