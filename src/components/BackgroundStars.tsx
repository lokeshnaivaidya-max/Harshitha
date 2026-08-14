import React, { useMemo } from 'react';

export const BackgroundStars: React.FC = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 65 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.7 + 0.3,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true" id="ambient-background">
      {/* Deep Romantic Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-gradient-to-br from-purple-900/25 via-pink-900/15 to-transparent blur-3xl" />
      <div className="absolute top-[35%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-br from-rose-900/20 via-amber-900/15 to-transparent blur-3xl" />
      <div className="absolute bottom-[-10%] left-[20%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full bg-gradient-to-tr from-fuchsia-950/30 via-rose-950/20 to-transparent blur-3xl" />

      {/* Twinkling Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
            opacity: star.opacity,
            boxShadow: `0 0 ${star.size * 3}px rgba(255, 255, 255, 0.8)`,
          }}
        />
      ))}
    </div>
  );
};
