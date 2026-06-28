// A soft white glow that trails the cursor across the dark green canvas —
// mix-blend-mode: screen so it only brightens whatever it passes over
// (background, text, links) instead of sitting on top as a flat circle.
// Eased toward the pointer each frame for a gentle drifting feel rather
// than snapping straight to the raw mouse position.
export function initCursorGlow(): void {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touchOnly = matchMedia('(hover: none)').matches;
  if (reduce || touchOnly) return;

  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  glow.setAttribute('aria-hidden', 'true');
  document.body.appendChild(glow);

  let x = innerWidth / 2;
  let y = innerHeight / 2;
  let targetX = x;
  let targetY = y;

  addEventListener(
    'mousemove',
    (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      glow.style.opacity = '1';
    },
    { passive: true }
  );
  addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  const tick = () => {
    x += (targetX - x) * 0.12;
    y += (targetY - y) * 0.12;
    glow.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
