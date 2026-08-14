import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/sound';
import confetti from 'canvas-confetti';

export interface Balloon {
  id: number;
  x: number; // % from left
  speed: number;
  size: number;
  color: string;
  shineColor: string;
  letter?: string;
  popped: boolean;
}

const BALLOON_PALETTE = [
  { color: '#f43f5e', shine: '#fda4af' }, // Rose
  { color: '#ec4899', shine: '#fbcfe8' }, // Pink
  { color: '#fbbf24', shine: '#fef08a' }, // Warm Gold
  { color: '#a855f7', shine: '#e9d5ff' }, // Purple
  { color: '#06b6d4', shine: '#a5f3fc' }, // Cyan
  { color: '#fb7185', shine: '#ffe4e6' }, // Coral
  { color: '#e11d48', shine: '#fecdd3' }, // Crimson
];

const LETTERS = ['H', 'A', 'P', 'P', 'Y', 'B', 'I', 'R', 'T', 'H', 'D', 'A', 'Y', '❤️', '✨'];

export const FloatingBalloons: React.FC = () => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);

  // Spawn initial balloons
  useEffect(() => {
    const initialBalloons: Balloon[] = Array.from({ length: 9 }).map((_, i) => {
      const pal = BALLOON_PALETTE[i % BALLOON_PALETTE.length];
      return {
        id: Date.now() + i * 100,
        x: 5 + Math.random() * 90,
        speed: 18 + Math.random() * 15,
        size: 50 + Math.random() * 25,
        color: pal.color,
        shineColor: pal.shine,
        letter: LETTERS[i % LETTERS.length],
        popped: false,
      };
    });
    setBalloons(initialBalloons);

    // Periodically spawn new balloon
    const interval = setInterval(() => {
      setBalloons((prev) => {
        if (prev.filter((b) => !b.popped).length > 15) return prev;
        const pal = BALLOON_PALETTE[Math.floor(Math.random() * BALLOON_PALETTE.length)];
        const newBalloon: Balloon = {
          id: Date.now() + Math.random(),
          x: 5 + Math.random() * 90,
          speed: 18 + Math.random() * 15,
          size: 50 + Math.random() * 25,
          color: pal.color,
          shineColor: pal.shine,
          letter: LETTERS[Math.floor(Math.random() * LETTERS.length)],
          popped: false,
        };
        return [...prev.slice(-12), newBalloon];
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handlePop = (balloon: Balloon, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playPopSound();

    // Trigger mini confetti at click position
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 25,
      spread: 45,
      origin: { x, y },
      colors: [balloon.color, balloon.shineColor, '#ffffff'],
      ticks: 120,
      gravity: 1,
      scalar: 0.8,
      zIndex: 9999,
    });

    setBalloons((prev) =>
      prev.map((b) => (b.id === balloon.id ? { ...b, popped: true } : b))
    );
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden" id="floating-balloons-layer">
      {balloons.map((balloon) => {
        if (balloon.popped) return null;

        return (
          <div
            key={balloon.id}
            onClick={(e) => handlePop(balloon, e)}
            className="absolute pointer-events-auto cursor-pointer group select-none transition-transform active:scale-90"
            style={{
              left: `${balloon.x}%`,
              bottom: '-120px',
              animation: `floatUp ${balloon.speed}s linear infinite`,
            }}
            title="Click to pop!"
          >
            {/* Balloon Body */}
            <div
              className="relative rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
              style={{
                width: `${balloon.size}px`,
                height: `${balloon.size * 1.25}px`,
                backgroundColor: balloon.color,
                boxShadow: `inset -6px -6px 12px rgba(0,0,0,0.3), inset 6px 6px 12px ${balloon.shineColor}88, 0 8px 20px rgba(0,0,0,0.35)`,
              }}
            >
              {/* Highlight reflection */}
              <div
                className="absolute top-2 left-3 rounded-full opacity-75"
                style={{
                  width: `${balloon.size * 0.22}px`,
                  height: `${balloon.size * 0.4}px`,
                  backgroundColor: balloon.shineColor,
                  transform: 'rotate(-25deg)',
                }}
              />

              {/* Letter / Symbol on balloon */}
              {balloon.letter && (
                <span className="text-white font-bold text-sm md:text-base drop-shadow-md z-10">
                  {balloon.letter}
                </span>
              )}

              {/* Balloon knot */}
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-2 rounded-sm"
                style={{ backgroundColor: balloon.color }}
              />

              {/* Balloon String */}
              <div className="absolute top-[100%] left-1/2 w-[1.5px] h-16 bg-white/40 -translate-x-1/2 origin-top animate-[sway_3s_ease-in-out_infinite]" />
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.9;
          }
          50% {
            transform: translateY(-60vh) translateX(25px);
          }
          100% {
            transform: translateY(-130vh) translateX(-15px);
            opacity: 0;
          }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
      `}</style>
    </div>
  );
};
