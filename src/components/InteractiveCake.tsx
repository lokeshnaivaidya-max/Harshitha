import React, { useState } from 'react';
import { Cake, Flame, Wind, RotateCcw, Heart, CheckCircle2, PartyPopper, Sparkles, Utensils, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine } from '../utils/sound';
import { triggerCandleExtinguishBurst, triggerCakeSliceCelebration } from '../utils/confetti';
import { harshithaData } from '../data/harshitha';

export const InteractiveCake: React.FC = () => {
  const [isCandleLit, setIsCandleLit] = useState(true);
  const [isCakeCut, setIsCakeCut] = useState(false);
  const [isCutting, setIsCutting] = useState(false);
  const [showCelebrationBanner, setShowCelebrationBanner] = useState(false);
  const [eatenSlices, setEatenSlices] = useState<number[]>([]);
  const [centerpieceEaten, setCenterpieceEaten] = useState(false);

  // Handle Blow Candle
  const handleBlowCandle = () => {
    if (!isCandleLit) return;
    soundEngine.playCandleBlowSound();
    setIsCandleLit(false);
    triggerCandleExtinguishBurst(0.5, 0.45);
  };

  // Handle Cut Cake
  const handleCutCake = () => {
    if (isCakeCut || isCutting) return;
    setIsCutting(true);
    soundEngine.playCakeSliceSound();

    // Knife cutting animation triggers the realistic slice split
    setTimeout(() => {
      setIsCakeCut(true);
      setIsCutting(false);
      triggerCakeSliceCelebration();
      setShowCelebrationBanner(true);
      soundEngine.playSparkleSound();
    }, 950);
  };

  // Handle Eat Served Slice
  const handleEatSlice = (index: number) => {
    if (eatenSlices.includes(index)) return;
    soundEngine.playSparkleSound();
    setEatenSlices((prev) => [...prev, index]);
  };

  // Handle Eat Centerpiece Slice
  const handleEatCenterpiece = () => {
    if (centerpieceEaten) return;
    soundEngine.playSparkleSound();
    setCenterpieceEaten(true);
  };

  // Reset Ritual
  const handleReset = () => {
    soundEngine.playSparkleSound();
    setIsCandleLit(true);
    setIsCakeCut(false);
    setIsCutting(false);
    setCenterpieceEaten(false);
    setEatenSlices([]);
    setShowCelebrationBanner(false);
  };

  return (
    <section id="cake" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

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
      <div className="relative glass-panel rounded-3xl p-6 sm:p-10 md:p-12 border border-rose-500/20 text-center shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Status Prompt */}
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

            {!isCandleLit && !isCakeCut && !isCutting && (
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

            {isCutting && (
              <motion.div
                key="cutting-step"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-sm font-medium shadow-[0_0_20px_rgba(251,191,36,0.3)]"
              >
                <Utensils className="w-4 h-4 text-amber-400 animate-spin" />
                <span>Golden knife slicing through the layers into separate pieces... ✨</span>
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
                <span>The cake is sliced into separate pieces! Click a slice to take a bite! 🍰❤️</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* The 3D Interactive Cake Model Container */}
        <div className="relative min-h-[380px] sm:min-h-[400px] flex flex-col items-center justify-end select-none my-4">
          {/* Animated Golden Cake Knife cutting smoothly through center */}
          <AnimatePresence>
            {isCutting && (
              <motion.div
                initial={{ y: -160, opacity: 0, rotate: -25 }}
                animate={{ y: 90, opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, y: 130 }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
                className="absolute z-50 pointer-events-none flex flex-col items-center"
              >
                {/* Knife Handle */}
                <div className="w-4 h-16 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 rounded-t-md border border-amber-400/50 shadow-xl relative">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mx-auto mt-2" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mx-auto mt-2" />
                </div>
                {/* Knife Guard */}
                <div className="w-11 h-2.5 bg-gradient-to-r from-amber-300 via-amber-100 to-amber-400 rounded-sm shadow-md" />
                {/* Knife Blade */}
                <div className="w-3.5 h-32 bg-gradient-to-r from-slate-200 via-white to-slate-300 border-x border-b border-amber-300/60 shadow-[0_0_20px_rgba(255,255,255,0.9)] [clip-path:polygon(0_0,100%_0,100%_85%,50%_100%,0_85%)]" />
                {/* Slice Sparkles */}
                <Sparkles className="w-7 h-7 text-amber-300 animate-ping absolute -bottom-3" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Candle on Top */}
          <div
            onClick={handleBlowCandle}
            className={`relative flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-110 z-30 mb-[-4px] ${
              isCandleLit ? 'group' : ''
            }`}
            title={isCandleLit ? 'Click to blow out candle!' : 'Candle blown out'}
          >
            {/* Candle Flame & Glow */}
            {isCandleLit ? (
              <div className="relative mb-0.5">
                <div className="absolute -inset-2 bg-amber-400/30 rounded-full blur-md animate-pulse" />
                <div className="w-5 h-8 bg-gradient-to-t from-amber-500 via-yellow-400 to-rose-300 rounded-full rounded-t-[50%] animate-flame shadow-[0_0_25px_#fbbf24]" />
              </div>
            ) : (
              <div className="relative h-8 flex flex-col items-center justify-end">
                <div className="w-2.5 h-6 bg-gradient-to-t from-gray-400/60 to-transparent rounded-full animate-smoke" />
              </div>
            )}

            {/* Candle Wick */}
            <div className="w-1 h-2 bg-stone-700" />

            {/* Candle Body */}
            <div className="w-5 h-14 rounded-t-sm bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400 border border-amber-400/60 shadow-md relative overflow-hidden">
              <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,#e11d48_4px,#e11d48_8px)]" />
            </div>
          </div>

          {/* CAKE STRUCTURE: Multi-Part Slice Model */}
          <div className="relative flex items-end justify-center z-20">
            {/* LEFT HALF OF CAKE */}
            <motion.div
              animate={{
                x: isCakeCut ? -48 : 0,
                rotate: isCakeCut ? -5 : 0,
                y: isCakeCut ? -4 : 0,
              }}
              transition={{ duration: 0.85, type: 'spring', bounce: 0.35 }}
              className="flex flex-col items-end relative"
            >
              {/* Top Tier - Left Half */}
              <div className="w-24 sm:w-32 h-14 bg-gradient-to-r from-rose-400 via-pink-300 to-pink-200 rounded-tl-2xl shadow-lg border-t border-l border-b border-pink-200/40 relative overflow-hidden flex items-center justify-around pr-2">
                {/* Frosting Drips */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-white/95 rounded-bl-lg shadow-sm" />
                
                {/* Exposed Cut Inner Cross-Section on right edge */}
                {isCakeCut && (
                  <div className="absolute right-0 top-0 bottom-0 w-4 bg-[#3a0d1e] border-l border-amber-300/50 flex flex-col justify-between py-1 px-0.5 shadow-inner">
                    <div className="h-1.5 bg-rose-200 rounded-xs" />
                    <div className="h-2 bg-[#881337] rounded-xs" />
                    <div className="h-1.5 bg-amber-100 rounded-xs" />
                    <div className="h-2 bg-[#4c0519] rounded-xs" />
                  </div>
                )}

                {/* Decorative Pearls */}
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-gradient-to-b from-amber-200 to-amber-400 shadow-sm z-10"
                  />
                ))}
              </div>

              {/* Bottom Tier - Left Half */}
              <div className="w-34 sm:w-44 h-22 bg-gradient-to-r from-[#4c1d32] via-[#702446] to-[#5a1b37] rounded-tl-2xl shadow-xl border-t border-l border-b border-rose-400/30 relative overflow-hidden flex items-center justify-start pl-4">
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-rose-100 via-pink-50 to-rose-100 rounded-bl-md shadow-inner" />
                
                {/* Inscription Left */}
                <span className="font-script text-lg sm:text-2xl text-amber-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide pointer-events-none truncate pr-2">
                  Happy B'day
                </span>

                {/* Detailed Inner sponge layers cross section */}
                {isCakeCut && (
                  <div className="absolute right-0 top-0 bottom-0 w-5 bg-[#2a0817] border-l-2 border-amber-400/60 flex flex-col justify-between py-1 px-0.5 shadow-inner">
                    <div className="h-2.5 bg-rose-200/95 rounded-xs" />
                    <div className="h-2 bg-[#be123c] rounded-xs" />
                    <div className="h-2.5 bg-amber-100/90 rounded-xs" />
                    <div className="h-2 bg-[#9f1239] rounded-xs" />
                    <div className="h-2.5 bg-[#4c0519] rounded-xs" />
                  </div>
                )}
              </div>
            </motion.div>

            {/* SEPARATED CENTERPIECE SLICE (Pulls forward distinctly on cut) */}
            <AnimatePresence>
              {isCakeCut && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, y: 0, x: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 32,
                    x: 0,
                    rotate: -3,
                  }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ delay: 0.15, duration: 0.7, type: 'spring', bounce: 0.4 }}
                  onClick={handleEatCenterpiece}
                  className="relative z-40 mx-[-12px] mb-[-16px] cursor-pointer group/slice"
                  title="Click to taste the VIP centerpiece slice!"
                >
                  {/* Golden Dessert Plate under slice */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-gradient-to-r from-amber-300 via-amber-100 to-amber-400 rounded-full border border-amber-400 shadow-xl pointer-events-none" />

                  {/* Cut Slice Body */}
                  <div className="relative w-20 sm:w-24 h-32 flex flex-col items-center justify-end transform transition-transform group-hover/slice:scale-105 group-hover/slice:-translate-y-2">
                    {/* Top Cream Swirl & Strawberry */}
                    <div className="relative -mb-2 z-20 flex flex-col items-center">
                      <span className="text-xl animate-bounce">🍓</span>
                      <div className="w-5 h-3 bg-white rounded-full shadow-sm" />
                    </div>

                    {/* Top Tier Slice Section */}
                    <div className="w-16 h-10 bg-gradient-to-b from-pink-200 via-rose-300 to-[#881337] rounded-t-lg border border-amber-300/60 shadow-md relative overflow-hidden px-1 py-0.5 flex flex-col justify-between">
                      <div className="h-1 bg-white/90 rounded-full" />
                      <div className="h-1.5 bg-[#4c0519] rounded-xs" />
                      <div className="h-1 bg-amber-100 rounded-full" />
                    </div>

                    {/* Bottom Tier Slice Section */}
                    <div className="w-20 h-16 bg-gradient-to-b from-[#702446] via-[#be123c] to-[#2a0817] rounded-b-lg border border-amber-400/80 shadow-2xl relative overflow-hidden px-1.5 py-1 flex flex-col justify-between">
                      <div className="h-2 bg-rose-100 rounded-xs" />
                      <div className="h-2 bg-[#9f1239] rounded-xs" />
                      <div className="h-2 bg-amber-100/90 rounded-xs" />
                      <div className="h-2.5 bg-[#4c0519] rounded-xs" />
                    </div>

                    {/* Slice Badge */}
                    <div className="absolute -top-3 right-0 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-md border border-white/20 whitespace-nowrap">
                      {centerpieceEaten ? '✨ Tasted!' : '🍴 Fresh Slice'}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* RIGHT HALF OF CAKE */}
            <motion.div
              animate={{
                x: isCakeCut ? 48 : 0,
                rotate: isCakeCut ? 5 : 0,
                y: isCakeCut ? -4 : 0,
              }}
              transition={{ duration: 0.85, type: 'spring', bounce: 0.35 }}
              className="flex flex-col items-start relative"
            >
              {/* Top Tier - Right Half */}
              <div className="w-24 sm:w-32 h-14 bg-gradient-to-r from-pink-200 via-pink-300 to-rose-400 rounded-tr-2xl shadow-lg border-t border-r border-b border-pink-200/40 relative overflow-hidden flex items-center justify-around pl-2">
                <div className="absolute top-0 left-0 right-0 h-4 bg-white/95 rounded-br-lg shadow-sm" />
                
                {/* Exposed Cut Inner Cross-Section on left edge */}
                {isCakeCut && (
                  <div className="absolute left-0 top-0 bottom-0 w-4 bg-[#3a0d1e] border-r border-amber-300/50 flex flex-col justify-between py-1 px-0.5 shadow-inner">
                    <div className="h-1.5 bg-rose-200 rounded-xs" />
                    <div className="h-2 bg-[#881337] rounded-xs" />
                    <div className="h-1.5 bg-amber-100 rounded-xs" />
                    <div className="h-2 bg-[#4c0519] rounded-xs" />
                  </div>
                )}

                {/* Decorative Pearls */}
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-gradient-to-b from-amber-200 to-amber-400 shadow-sm z-10"
                  />
                ))}
              </div>

              {/* Bottom Tier - Right Half */}
              <div className="w-34 sm:w-44 h-22 bg-gradient-to-r from-[#5a1b37] via-[#702446] to-[#4c1d32] rounded-tr-2xl shadow-xl border-t border-r border-b border-rose-400/30 relative overflow-hidden flex items-center justify-end pr-4">
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-rose-100 via-pink-50 to-rose-100 rounded-br-md shadow-inner" />
                
                {/* Inscription Right */}
                <span className="font-script text-lg sm:text-2xl text-amber-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide pointer-events-none truncate pl-2">
                  Harshitha!
                </span>

                {/* Detailed Inner sponge layers cross section */}
                {isCakeCut && (
                  <div className="absolute left-0 top-0 bottom-0 w-5 bg-[#2a0817] border-r-2 border-amber-400/60 flex flex-col justify-between py-1 px-0.5 shadow-inner">
                    <div className="h-2.5 bg-rose-200/95 rounded-xs" />
                    <div className="h-2 bg-[#be123c] rounded-xs" />
                    <div className="h-2.5 bg-amber-100/90 rounded-xs" />
                    <div className="h-2 bg-[#9f1239] rounded-xs" />
                    <div className="h-2.5 bg-[#4c0519] rounded-xs" />
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* CAKE STAND / PLATTER */}
          <div className="w-80 sm:w-[450px] h-4 bg-gradient-to-r from-amber-400 via-yellow-100 to-amber-400 rounded-full shadow-[0_10px_25px_rgba(251,191,36,0.35)] border border-amber-300 relative z-10 -mt-0.5" />
          <div className="w-28 sm:w-36 h-7 bg-gradient-to-b from-amber-300 to-amber-500 rounded-b-2xl shadow-md border-x border-b border-amber-400" />
        </div>

        {/* SERVED SLICES TRAY (Appears once cake is cut) */}
        <AnimatePresence>
          {isCakeCut && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
              className="mt-8 pt-6 border-t border-rose-500/20"
            >
              <div className="text-center mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  🍰 Freshly Cut Slices for Harshitha & Friends
                </span>
                <p className="text-xs text-rose-200/70 mt-1">
                  Click a slice to take a delicious celebratory bite!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {/* Slice 1: Harshitha's Royal Slice */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEatSlice(1)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left relative overflow-hidden ${
                    eatenSlices.includes(1)
                      ? 'bg-rose-950/20 border-rose-500/20 opacity-70'
                      : 'bg-gradient-to-b from-rose-900/40 to-black/60 border-amber-400/40 shadow-lg hover:border-amber-400/80 shadow-[0_4px_20px_rgba(244,63,94,0.2)]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-2xl">{eatenSlices.includes(1) ? '✨😋' : '🍰'}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-200 border border-rose-400/30">
                      VIP Slice #1
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-amber-200 mt-2">
                    Harshitha's First Bite
                  </h4>
                  <p className="text-[11px] text-rose-200/70 font-light mt-0.5">
                    {eatenSlices.includes(1)
                      ? 'Tasted sweet & magical! 💖'
                      : 'Strawberry sponge with vanilla buttercream'}
                  </p>
                  {eatenSlices.includes(1) && (
                    <div className="mt-2 text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Eaten with love!
                    </div>
                  )}
                </motion.div>

                {/* Slice 2: Raspberry Chocolate Twist */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEatSlice(2)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left relative overflow-hidden ${
                    eatenSlices.includes(2)
                      ? 'bg-rose-950/20 border-rose-500/20 opacity-70'
                      : 'bg-gradient-to-b from-rose-900/40 to-black/60 border-rose-400/30 shadow-lg hover:border-rose-400/70 shadow-[0_4px_20px_rgba(244,63,94,0.2)]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-2xl">{eatenSlices.includes(2) ? '✨🍓' : '🎂'}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30">
                      Slice #2
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-rose-100 mt-2">
                    Raspberry Choco Delight
                  </h4>
                  <p className="text-[11px] text-rose-200/70 font-light mt-0.5">
                    {eatenSlices.includes(2)
                      ? 'Delicious & velvety chocolate! 🍫'
                      : 'Dark chocolate fudge with ruby berry glaze'}
                  </p>
                  {eatenSlices.includes(2) && (
                    <div className="mt-2 text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Shared & enjoyed!
                    </div>
                  )}
                </motion.div>

                {/* Slice 3: Golden Fortune Slice */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEatSlice(3)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left relative overflow-hidden ${
                    eatenSlices.includes(3)
                      ? 'bg-rose-950/20 border-rose-500/20 opacity-70'
                      : 'bg-gradient-to-b from-rose-900/40 to-black/60 border-amber-400/30 shadow-lg hover:border-amber-400/70 shadow-[0_4px_20px_rgba(251,191,36,0.2)]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-2xl">{eatenSlices.includes(3) ? '✨👑' : '🧁'}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-200 border border-yellow-400/30">
                      Fortune Slice
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-amber-100 mt-2">
                    Golden Wish Slice
                  </h4>
                  <p className="text-[11px] text-rose-200/70 font-light mt-0.5">
                    {eatenSlices.includes(3)
                      ? 'A year of good fortune unlocked! 🌟'
                      : 'Topped with edible gold dust and white cream'}
                  </p>
                  {eatenSlices.includes(3) && (
                    <div className="mt-2 text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Blessing received!
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
            disabled={isCandleLit || isCakeCut || isCutting}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 cursor-pointer ${
              !isCandleLit && !isCakeCut && !isCutting
                ? 'bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 text-white shadow-[0_0_25px_rgba(244,63,94,0.6)] hover:scale-105 active:scale-95 animate-bounce'
                : isCakeCut
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                : 'bg-white/10 text-stone-400 border border-white/10 cursor-not-allowed opacity-50'
            }`}
          >
            <Cake className="w-4 h-4" />
            <span>{isCakeCut ? 'Cake Sliced into Pieces! 🍰' : isCutting ? 'Cutting Cake... 🔪' : 'Cut Birthday Cake 🔪'}</span>
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
