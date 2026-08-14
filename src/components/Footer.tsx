import React from 'react';
import { Heart, PartyPopper, ArrowUp, ImagePlus } from 'lucide-react';
import { harshithaData } from '../data/harshitha';
import { soundEngine } from '../utils/sound';
import { triggerBirthdayConfetti, triggerHeartBurst } from '../utils/confetti';
import { usePhotoContext } from '../context/PhotoContext';

export const Footer: React.FC = () => {
  const { setIsAdminOpen } = usePhotoContext();

  const handleFinalCelebration = () => {
    soundEngine.playSparkleSound();
    triggerBirthdayConfetti();
    setTimeout(() => {
      triggerHeartBurst();
    }, 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-rose-500/20 py-16 px-4 sm:px-6 lg:px-8 text-center bg-[#0a070e] overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        {/* Heart Icon Burst Trigger */}
        <div className="flex justify-center">
          <button
            onClick={handleFinalCelebration}
            className="group p-4 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 text-white shadow-[0_0_30px_rgba(244,63,94,0.5)] hover:shadow-[0_0_50px_rgba(244,63,94,0.8)] hover:scale-115 active:scale-95 transition-all duration-300 cursor-pointer"
            title="Click for celebration fireworks!"
          >
            <Heart className="w-7 h-7 fill-white animate-pulse" />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-100 to-amber-200">
            Happy Birthday, {harshithaData.name}! 🎉
          </h3>
          <p className="text-xs sm:text-sm text-rose-200/60 max-w-md mx-auto font-light">
            Wishing you a year filled with grand dreams coming true, radiant health, and unforgettable joy.
          </p>
        </div>

        {/* Back to top, Admin & Replay */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-rose-300/70">
          <button
            onClick={() => setIsAdminOpen(true)}
            className="hover:text-rose-200 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-400/30 hover:bg-rose-500/25 transition cursor-pointer text-rose-200 font-medium"
          >
            <ImagePlus className="w-3.5 h-3.5 text-rose-400" />
            <span>Manage & Upload Photos (Admin)</span>
          </button>

          <button
            onClick={handleFinalCelebration}
            className="hover:text-rose-200 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer"
          >
            <PartyPopper className="w-3.5 h-3.5 text-amber-300" />
            <span>Party Popper Fireworks</span>
          </button>

          <button
            onClick={scrollToTop}
            className="hover:text-rose-200 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5 text-rose-400" />
            <span>Back to Top</span>
          </button>
        </div>

        <div className="pt-6 border-t border-rose-500/10 text-[11px] text-rose-300/40">
          Crafted with love for Harshitha • All moments celebrated
        </div>
      </div>
    </footer>
  );
};
