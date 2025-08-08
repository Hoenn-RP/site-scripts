document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('.hoenn-exhibit');
  if (!containers.length) return;

  containers.forEach(container => {
    const sprites = Array.from(container.getElementsByTagName('img'));

    // === Editable Settings ===
    const speedMultiplier = 0.2;  // Lower is slower
    const bounceHeight = 1;       // How high they jump on click
    const visiblePadding = 30;    // How far they can go "offscreen"
    // =========================

    // Get initial state using actual image sizes
    const state = sprites.map(img => {
      const width = img.offsetWidth;
      const height = img.offsetHeight;

      return {
        x: Math.random() * (container.clientWidth - width),
        y: Math.random() * (container.clientHeight - height),
        dx: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? 1 : -1) * speedMultiplier,
        dy: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? 1 : -1) * speedMultiplier,
        width,
        height,
        paused: false,
      };
    });

    sprites.forEach((img, i) => {
      img.style.position = 'absolute';
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
        void img.offsetWidth; // force reflow
        img.classList.add('pkmnclicked');
      });

      img.addEventListener('animationend', () => {
        img.classList.remove('pkmnclicked');
      });
    });

    function animate() {
      const bounds = container.getBoundingClientRect();
      const maxX = bounds.width + visiblePadding;
      const maxY = bounds.height + visiblePadding;
      const min = -visiblePadding;

      sprites.forEach((img, i) => {
        if (state[i].paused) return;

        const { width, height } = state[i];

        state[i].x += state[i].dx;
        state[i].y += state[i].dy;

        if (state[i].x <= min || state[i].x >= maxX - width) state[i].dx *= -1;
        if (state[i].y <= min || state[i].y >= maxY - height) state[i].dy *= -1;

        state[i].x = Math.max(min, Math.min(maxX - width, state[i].x));
        state[i].y = Math.max(min, Math.min(maxY - height, state[i].y));

        img.style.left = state[i].x + 'px';
        img.style.top = state[i].y + 'px';
      });

      requestAnimationFrame(animate);
    }

    animate();
  });
});
