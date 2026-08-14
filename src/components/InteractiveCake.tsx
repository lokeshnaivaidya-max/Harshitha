import React, { useState } from 'react';
import { Cake, Flame, Wind, RotateCcw, Heart, CheckCircle2, PartyPopper } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine } from '../utils/sound';
import { triggerCandleExtinguishBurst, triggerCakeSliceCelebration } from '../utils/confetti';
import { harshithaData } from '../data/harshitha';

export const InteractiveCake: React.FC = () => {
  const [isCandleLit, setIsCandleLit] = useState(true);
  const [isCakeCut, setIsCakeCut] = useState(false);
  const [sliceOffset, setSliceOffset] = useState(0);
  const [showCelebrationBanner, setShowCelebrationBanner] = useState(false);

  // Handle Blow Candle
  const handleBlowCandle = () => {
    if (!isCandleLit) return;
    soundEngine.playCandleBlowSound();
    setIsCandleLit(false);
    triggerCandleExtinguishBurst(0.5, 0.45);
  };

  // Handle Cut Cake
  const handleCutCake = () => {
    if (isCakeCut) return;
    soundEngine.playCakeSliceSound();
    setIsCakeCut(true);
    setSliceOffset(45);
    triggerCakeSliceCelebration();
    setShowCelebrationBanner(true);
  };

  // Reset Ritual
  const handleReset = () => {
    soundEngine.playSparkleSound();
    setIsCandleLit(true);
    setIsCakeCut(false);
    setSliceOffset(0);
    setShowCelebrationBanner(false);
  };

  return (
    <section id="cake" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-widest">
          <Cake className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive Celebration Ritual</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-rose-200 to-pink-200">
          {harshithaData.cakeSection.title}
        </h2>
        <p className="text-rose-200/75 max-w-xl mx-auto text-sm sm:text-base font-light">
          {harshithaData.cakeSection.subtitle}
        </p>
      </div>

      {/* Interactive Cake Stage */}
      <div className="relative glass-panel rounded-3xl p-6 sm:p-10 md:p-12 border border-rose-500/20 text-center shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        {/* Status Prompt / Hint */}
        <div className="mb-8">
          <AnimatePresence mode="wait">
            {isCandleLit && (
              <motion.div
                key="blow-step"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-sm font-medium shadow-[0_0_20px_rgba(251,191,36,0.3)] animate-pulse"
              >
                <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>Step 1: Make a wish and click to <strong>Blow Out The Candle</strong>!</span>
              </motion.div>
            )}

            {!isCandleLit && !isCakeCut && (
              <motion.div
                key="cut-step"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-200 text-sm font-medium shadow-[0_0_20px_rgba(244,63,94,0.3)] animate-pulse"
              >
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                <span>Step 2: Wish made! Now click to <strong>Cut Harshitha's Cake</strong> 🍰</span>
              </motion.div>
            )}

            {isCakeCut && (
              <motion.div
                key="celebrate-step"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-sm font-medium shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Happy Birthday Harshitha! May all your wishes come true! ❤️</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* The Cake & Candle Visual Artifact */}
        <div className="relative h-72 sm:h-80 flex flex-col items-center justify-end select-none my-4">
          {/* Candle on Top */}
          <div
            onClick={handleBlowCandle}
            className={`relative flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-110 z-30 ${
              isCandleLit ? 'group' : ''
            }`}
            title={isCandleLit ? 'Click to blow out candle!' : 'Candle blown out'}
          >
            {/* Candle Flame & Glow */}
            {isCandleLit ? (
              <div className="relative mb-0.5">
                {/* Outer Glow */}
                <div className="absolute -inset-2 bg-amber-400/30 rounded-full blur-md animate-pulse" />
                {/* Flame Teardrop */}
                <div className="w-5 h-8 bg-gradient-to-t from-amber-500 via-yellow-400 to-rose-300 rounded-full rounded-t-[50%] animate-flame shadow-[0_0_25px_#fbbf24]" />
              </div>
            ) : (
              /* Smoke trail after candle blown out */
              <div className="relative h-8 flex flex-col items-center justify-end">
                <div className="w-2.5 h-6 bg-gradient-to-t from-gray-400/60 to-transparent rounded-full animate-smoke" />
              </div>
            )}

            {/* Candle Wick */}
            <div className="w-1 h-2 bg-stone-700" />

            {/* Candle Body (Golden Striped Pillar) */}
            <div className="w-5 h-16 rounded-t-sm bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400 border border-amber-400/60 shadow-md relative overflow-hidden">
              <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,#e11d48_4px,#e11d48_8px)]" />
            </div>
          </div>

          {/* Cake Structure */}
          <div className="relative flex flex-col items-center z-20">
            {/* Cake Layer 1 (Top Tier - Pink Velvet) */}
            <div className="w-44 sm:w-56 h-14 bg-gradient-to-r from-rose-400 via-pink-300 to-rose-400 rounded-t-2xl shadow-lg border border-pink-200/40 relative overflow-hidden flex items-center justify-around px-3">
              {/* Cream Drips */}
              <div className="absolute top-0 left-0 right-0 h-4 bg-white/90 rounded-b-xl shadow-sm" />
              {/* Decorative Pearls */}
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-gradient-to-b from-amber-200 to-amber-400 shadow-sm z-10"
                />
              ))}
            </div>

            {/* Cake Layer 2 (Bottom Tier - Chocolate & Rose Gold Cream) */}
            <div
              className={`relative transition-all duration-700 ease-out ${
                isCakeCut ? 'shadow-2xl' : ''
              }`}
            >
              <div className="w-64 sm:w-80 h-20 bg-gradient-to-r from-[#4c1d32] via-[#702446] to-[#4c1d32] rounded-t-xl shadow-xl border border-rose-400/30 relative overflow-hidden flex items-center justify-between px-6">
                {/* Vanilla Cream Ribbon */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-rose-100 via-pink-50 to-rose-100 rounded-b-lg shadow-inner" />

                {/* Harshitha Golden Inscription */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="font-script text-2xl sm:text-3xl text-amber-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide">
                    Happy Birthday Harshitha
                  </span>
                </div>

                {/* Sliced Piece Separation Animation */}
                {isCakeCut && (
                  <motion.div
                    initial={{ x: 0, opacity: 0 }}
                    animate={{ x: 60, opacity: 1, rotate: 6 }}
                    transition={{ duration: 0.8, type: 'spring' }}
                    className="absolute -right-12 top-0 w-24 h-20 bg-gradient-to-r from-[#702446] to-[#501931] border-2 border-amber-300/80 rounded-lg shadow-2xl flex flex-col justify-between p-1 z-30"
                  >
                    <div className="text-[10px] font-bold text-amber-200 text-center">
                      Harshitha's Slice 🍰
                    </div>
                    <div className="h-2 bg-rose-200 rounded-full" />
                    <div className="h-2 bg-amber-200 rounded-full" />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Cake Stand / Platter */}
            <div className="w-72 sm:w-96 h-4 bg-gradient-to-r from-amber-400 via-yellow-100 to-amber-400 rounded-full shadow-[0_10px_25px_rgba(251,191,36,0.3)] border border-amber-300 relative z-10" />
            <div className="w-24 sm:w-32 h-6 bg-gradient-to-b from-amber-300 to-amber-500 rounded-b-xl shadow-md border-x border-b border-amber-400" />
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {/* Blow Candle Button */}
          <button
            onClick={handleBlowCandle}
            disabled={!isCandleLit}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 cursor-pointer ${
              isCandleLit
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-900 shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:scale-105 active:scale-95'
                : 'bg-white/10 text-stone-400 border border-white/10 cursor-not-allowed opacity-60'
            }`}
          >
            <Wind className="w-4 h-4" />
            <span>{isCandleLit ? 'Blow Out Candle 💨' : 'Candle Blown Out ✨'}</span>
          </button>

          {/* Cut Cake Button */}
          <button
            onClick={handleCutCake}
            disabled={isCandleLit || isCakeCut}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 cursor-pointer ${
              !isCandleLit && !isCakeCut
                ? 'bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 text-white shadow-[0_0_25px_rgba(244,63,94,0.6)] hover:scale-105 active:scale-95 animate-bounce'
                : isCakeCut
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                : 'bg-white/10 text-stone-400 border border-white/10 cursor-not-allowed opacity-50'
            }`}
          >
            <Cake className="w-4 h-4" />
            <span>{isCakeCut ? 'Cake Sliced! 🍰' : 'Cut Birthday Cake 🔪'}</span>
          </button>

          {/* Reset Ritual Button */}
          {(isCakeCut || !isCandleLit) && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-medium text-rose-200/80 bg-white/5 border border-white/10 hover:bg-white/15 hover:text-white transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Relight & Reset 🔄</span>
            </button>
          )}
        </div>

        {/* Flavor & Detail Note */}
        <p className="text-xs text-rose-300/60 mt-6 font-light">
          Flavor: <span className="text-rose-200 font-medium">{harshithaData.cakeSection.flavor}</span>
        </p>

        {/* Pop-up Celebration Message Card */}
        {showCelebrationBanner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-rose-950/80 via-purple-950/80 to-amber-950/80 border border-amber-400/40 shadow-2xl"
          >
            <PartyPopper className="w-8 h-8 text-amber-300 mx-auto mb-2" />
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-amber-200 mb-2">
              Cheers to You, Harshitha! 🥂
            </h3>
            <p className="text-rose-100/90 text-sm sm:text-base max-w-lg mx-auto font-light leading-relaxed">
              {harshithaData.cakeSection.afterBlowWishText}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
