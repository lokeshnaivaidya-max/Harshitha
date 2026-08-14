import React, { useEffect, useState, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  symbol: string;
  opacity: number;
  rotation: number;
}

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState<Particle[]>([]);
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const particleIdRef = useRef(0);

  const symbols = ['✨', '💖', '⭐', '🌸', '🪄', '🎉', '💫'];

  useEffect(() => {
    // Only enable on fine pointer devices (desktop)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });

      // Check if hovering interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = target.closest('button, a, input, textarea, select, [role="button"], .interactive-target');
        setIsPointer(!!isClickable);
      }

      // Add emoji particles trail when moving
      if (Math.random() > 0.4) {
        particleIdRef.current += 1;
        const newParticle: Particle = {
          id: particleIdRef.current,
          x: e.clientX + (Math.random() * 18 - 9),
          y: e.clientY + (Math.random() * 18 - 9),
          size: Math.random() * 8 + 12,
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          opacity: 0.9,
          rotation: Math.random() * 360,
        };

        setTrail((prev) => [...prev.slice(-18), newParticle]);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Particle decay & floating animation loop
    const interval = setInterval(() => {
      setTrail((prev) =>
        prev
          .map((p) => ({
            ...p,
            y: p.y - 1.2,
            opacity: p.opacity - 0.07,
            rotation: p.rotation + 3,
          }))
          .filter((p) => p.opacity > 0.05)
      );
    }, 40);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearInterval(interval);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden" id="custom-cursor-container">
      {/* Main Cursor Core */}
      <div
        className={`fixed pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-100 ease-out ${
          isPointer
            ? 'h-8 w-8 bg-rose-500/20 border-2 border-rose-400 scale-125'
            : 'h-5 w-5 bg-rose-400/15 border border-rose-300/50'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          boxShadow: '0 0 12px rgba(244, 63, 94, 0.35)',
        }}
      >
        <div className="absolute inset-0 m-auto h-1.5 w-1.5 rounded-full bg-rose-400 shadow-[0_0_6px_#f43f5e]" />
      </div>

      {/* Floating Cursor Emoji Particles Trail */}
      {trail.map((particle) => (
        <span
          key={particle.id}
          className="fixed pointer-events-none -translate-x-1/2 -translate-y-1/2 select-none"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            fontSize: `${particle.size}px`,
            opacity: particle.opacity,
            transform: `translate(-50%, -50%) rotate(${particle.rotation}deg)`,
            filter: 'drop-shadow(0 0 8px rgba(244, 114, 182, 0.7))',
            transition: 'opacity 0.1s ease-out',
          }}
        >
          {particle.symbol}
        </span>
      ))}
    </div>
  );
};
