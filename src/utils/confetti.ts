import confetti from 'canvas-confetti';

export const triggerBirthdayConfetti = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Realistic mix of colors
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#f43f5e', '#fb7185', '#fda4af', '#fbbf24', '#f59e0b', '#ec4899', '#c084fc'],
  });
  fire(0.2, {
    spread: 60,
    colors: ['#ffffff', '#ffd1dc', '#ffb6c1', '#fbcfe8'],
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#e11d48', '#be185d', '#d97706', '#f472b6'],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    colors: ['#fbbf24', '#fde68a', '#ffffff'],
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#fda4af', '#f43f5e', '#facc15'],
  });
};

export const triggerHeartBurst = () => {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const colors = ['#f43f5e', '#ec4899', '#fb7185', '#ffd1dc', '#fbbf24'];

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors,
      zIndex: 9999,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors,
      zIndex: 9999,
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };
  frame();
};

export const triggerCandleExtinguishBurst = (x: number = 0.5, y: number = 0.5) => {
  confetti({
    particleCount: 80,
    spread: 80,
    origin: { x, y },
    colors: ['#fbbf24', '#f59e0b', '#ffffff', '#fed7aa', '#f43f5e'],
    ticks: 200,
    gravity: 0.8,
    decay: 0.92,
    scalar: 0.9,
    zIndex: 9999,
  });
};

export const triggerCakeSliceCelebration = () => {
  triggerBirthdayConfetti();
  setTimeout(() => {
    triggerHeartBurst();
  }, 400);
};
