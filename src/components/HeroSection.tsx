import React from 'react';
import { Cake, Camera, Heart, Star, ArrowDown, Edit3 } from 'lucide-react';
import { motion } from 'motion/react';
import { harshithaData } from '../data/harshitha';
import { soundEngine } from '../utils/sound';
import { triggerBirthdayConfetti, triggerHeartBurst } from '../utils/confetti';
import { usePhotoContext } from '../context/PhotoContext';

export const HeroSection: React.FC = () => {
  const { heroPhoto, setIsAdminOpen } = usePhotoContext();

  const handleHeroConfetti = () => {
    soundEngine.playSparkleSound();
    triggerBirthdayConfetti();
    setTimeout(() => {
      triggerHeartBurst();
    }, 300);
  };

  return (
    <section
      id="top"
      className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Decorative ambient rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[550px] md:w-[750px] h-[350px] sm:h-[550px] md:h-[750px] rounded-full border border-rose-500/10 pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] sm:w-[420px] md:w-[600px] h-[250px] sm:h-[420px] md:h-[600px] rounded-full border border-amber-400/10 pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        {/* Left Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="lg:col-span-7 text-center lg:text-left space-y-6"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/15 border border-rose-400/30 text-rose-300 text-xs sm:text-sm font-medium shadow-[0_0_20px_rgba(244,63,94,0.2)]">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>Today is All About You ❤️</span>
            <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          </div>

          {/* Main Title */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-light text-rose-200/80 tracking-wider uppercase">
              {harshithaData.hero.titleFirst}
            </h2>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-pink-200 to-amber-200 drop-shadow-[0_4px_30px_rgba(244,63,94,0.35)]">
              {harshithaData.hero.titleHighlight}
              <span className="text-rose-500 inline-block ml-2 animate-pulse">❤️</span>
            </h1>
          </div>

          {/* Subtitle / Intro Note */}
          <p className="text-base sm:text-lg md:text-xl text-rose-100/75 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
            {harshithaData.hero.subtitle}
          </p>

          {/* Action CTAs */}
          <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <a
              href="#cake"
              className="flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 shadow-[0_0_25px_rgba(244,63,94,0.5)] hover:shadow-[0_0_40px_rgba(244,63,94,0.8)] hover:scale-105 active:scale-95 transition-all duration-300"
              id="hero-cut-cake-btn"
            >
              <Cake className="w-5 h-5 text-amber-200" />
              <span>{harshithaData.hero.ctaPrimary}</span>
            </a>

            <a
              href="#gallery"
              className="flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-full font-medium text-sm sm:text-base text-rose-200 bg-white/5 border border-rose-300/30 hover:bg-rose-500/20 hover:border-rose-400/50 hover:text-white transition-all duration-300"
              id="hero-explore-memories-btn"
            >
              <Camera className="w-5 h-5 text-rose-400" />
              <span>{harshithaData.hero.ctaSecondary}</span>
            </a>
          </div>

          {/* Quick Highlight Stats / Attributes */}
          <div className="pt-6 grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0 border-t border-rose-500/15">
            <div
              onClick={handleHeroConfetti}
              className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-rose-400/40 hover:bg-rose-500/10 cursor-pointer transition text-center group"
            >
              <div className="text-xl sm:text-2xl font-serif font-bold text-amber-300 group-hover:scale-110 transition-transform">
                100%
              </div>
              <div className="text-[11px] sm:text-xs text-rose-200/60 mt-0.5">Radiant Sunshine</div>
            </div>
            <div
              onClick={handleHeroConfetti}
              className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-rose-400/40 hover:bg-rose-500/10 cursor-pointer transition text-center group"
            >
              <div className="text-xl sm:text-2xl font-serif font-bold text-rose-400 group-hover:scale-110 transition-transform">
                ∞
              </div>
              <div className="text-[11px] sm:text-xs text-rose-200/60 mt-0.5">Precious Memories</div>
            </div>
            <div
              onClick={handleHeroConfetti}
              className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-rose-400/40 hover:bg-rose-500/10 cursor-pointer transition text-center group"
            >
              <div className="text-xl sm:text-2xl font-serif font-bold text-pink-300 group-hover:scale-110 transition-transform">
                #1
              </div>
              <div className="text-[11px] sm:text-xs text-rose-200/60 mt-0.5">Favorite Person</div>
            </div>
          </div>
        </motion.div>

        {/* Right Photo Display (Polaroid / Portrait Card) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
          className="lg:col-span-5 flex justify-center"
        >
          <div className="relative group max-w-sm sm:max-w-md w-full">
            {/* Ambient Background Glow behind card */}
            <div className="absolute -inset-2 bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 rounded-[32px] blur-xl opacity-40 group-hover:opacity-75 transition-opacity duration-500" />

            {/* Polaroid Frame Card */}
            <div className="relative bg-[#1a1224] border border-rose-400/30 rounded-3xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transform transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-1">
              {/* Tape Accent */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-amber-100/20 backdrop-blur-md border border-white/20 -rotate-2 rounded-sm shadow-sm z-20 pointer-events-none" />

              {/* Image Container */}
              <div
                className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-black/40 border border-white/10 group/img"
              >
                <img
                  src={heroPhoto}
                  alt={`Birthday celebration photo of ${harshithaData.name}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/harshitha/hero.svg';
                  }}
                />

                {/* Floating Heart Ribbon */}
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-xs font-semibold text-rose-100">
                      Celebrating Harshitha
                    </span>
                  </div>
                  <div className="flex items-center text-amber-300 text-xs font-medium gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    <span>Birthday Star</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Caption */}
              <div className="mt-4 pt-2 text-center">
                <p className="font-serif italic text-lg sm:text-xl text-rose-100/90">
                  "The one who makes life so much sweeter."
                </p>
                <p className="text-[11px] uppercase tracking-widest text-rose-400/70 mt-1 font-semibold">
                  Today & Always
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition cursor-pointer">
        <a href="#story" className="text-xs tracking-widest text-rose-200/70 uppercase">
          Explore
        </a>
        <ArrowDown className="w-4 h-4 text-rose-400 animate-bounce" />
      </div>
    </section>
  );
};
