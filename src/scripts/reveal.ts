// Entrance + scroll-reveal animations.
// - Splits the hero label into characters for a staggered drop.
// - Reveals hero body lines and captions on load.
// - Reveals .fade-up elements as they scroll into view.
// Respects prefers-reduced-motion (the CSS already disables transforms there).

export function initReveal(): void {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Split the hero label ("Mission") into per-character spans so each letter
  // can drop in with its own delay.
  const label = document.getElementById('hlabel');
  if (label) {
    const text = label.textContent?.trim() ?? '';
    label.textContent = '';
    [...text].forEach((c, i) => {
      const span = document.createElement('span');
      span.className = 'ch';
      span.textContent = c;
      span.style.transition = 'transform .8s cubic-bezier(.16,1,.3,1), opacity .6s ease';
      span.style.transitionDelay = `${0.12 + i * 0.05}s`;
      label.appendChild(span);
    });
  }

  // Fire hero entrance once everything is parsed.
  const runEntrance = () => {
    document.querySelectorAll<HTMLElement>('#hlabel .ch').forEach((ch) => {
      ch.style.transform = 'translateY(0)';
      ch.style.opacity = '1';
    });
    document.querySelectorAll<HTMLElement>('#hbody .bline').forEach((line, i) => {
      setTimeout(() => line.classList.add('in'), 650 + i * 85);
    });
    document.querySelectorAll<HTMLElement>('.hero .fade-up').forEach((el) => {
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => el.classList.add('in'), delay);
    });
  };
  if (document.readyState === 'complete') runEntrance();
  else addEventListener('load', runEntrance);

  // Reveal non-hero .fade-up elements (list rows, section headings) on scroll.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll('section .fade-up').forEach((el) => observer.observe(el));
}
