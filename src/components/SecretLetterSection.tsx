import React, { useState } from 'react';
import { Mail, Heart, Sparkles, Lock, Unlock, Printer, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { harshithaData } from '../data/harshitha';
import { soundEngine } from '../utils/sound';
import { triggerHeartBurst } from '../utils/confetti';

export const SecretLetterSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenLetter = () => {
    soundEngine.playEnvelopeOpenSound();
    setIsOpen(true);
    triggerHeartBurst();
  };

  const handleCloseLetter = () => {
    soundEngine.playEnvelopeOpenSound();
    setIsOpen(false);
  };

  return (
    <section id="letter" className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative">
      {/* Header */}
      <div className="text-center space-y-3 mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-widest">
          <Mail className="w-3.5 h-3.5 text-rose-400" />
          <span>From the Heart</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-pink-200 to-amber-200">
          A Letter For You
        </h2>
        <p className="text-rose-200/70 max-w-md mx-auto text-sm sm:text-base font-light">
          A personal, heartfelt message written just for you on your special day.
        </p>
      </div>

      {/* Envelope / Letter Interactive Experience */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* Sealed Wax Envelope View */
            <motion.div
              key="closed-envelope"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="max-w-xl mx-auto cursor-pointer group"
              onClick={handleOpenLetter}
            >
              {/* Envelope Body */}
              <div className="relative bg-gradient-to-b from-[#24152e] to-[#170a1e] border-2 border-rose-400/30 rounded-3xl p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-center relative overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:border-rose-400/60 group-hover:shadow-[0_25px_60px_rgba(244,63,94,0.3)]">
                {/* Envelope Flap Accent */}
                <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-rose-950/40 to-transparent clip-path-triangle pointer-events-none" />

                {/* Wax Seal Button in Center */}
                <div className="relative my-6 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-600 via-red-600 to-rose-900 border-2 border-amber-300/80 shadow-[0_0_30px_rgba(225,29,72,0.6)] flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <span className="font-serif font-bold text-3xl text-amber-200 drop-shadow-md">
                      H
                    </span>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-rose-300 tracking-wider uppercase">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Click to Break Wax Seal & Open</span>
                  </div>
                </div>

                <div className="space-y-1 mt-6">
                  <h3 className="font-serif text-2xl text-rose-100 font-bold">
                    {harshithaData.secretLetter.envelopeTitle}
                  </h3>
                  <p className="text-xs text-rose-300/60 font-medium">
                    Strictly for: <span className="text-amber-300 font-semibold">{harshithaData.name}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Opened Letter Parchment View */
            <motion.div
              key="opened-letter"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="relative max-w-2xl mx-auto bg-[#faf6ee] text-[#2c1d27] rounded-3xl p-8 sm:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-amber-200/80"
              style={{
                backgroundImage: 'radial-gradient(#e5d9c7 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            >
              {/* Vintage Corner Decors */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-rose-900/30 rounded-tl-lg pointer-events-none" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-rose-900/30 rounded-tr-lg pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-rose-900/30 rounded-bl-lg pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-rose-900/30 rounded-br-lg pointer-events-none" />

              {/* Letter Header */}
              <div className="flex items-center justify-between border-b border-rose-900/15 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-rose-900/60">
                    {harshithaData.secretLetter.letterDate}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="p-1.5 rounded-full hover:bg-rose-900/10 text-rose-900/70 transition cursor-pointer"
                    title="Print / Save Letter"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCloseLetter}
                    className="p-1.5 rounded-full hover:bg-rose-900/10 text-rose-900/70 transition cursor-pointer"
                    title="Re-fold envelope"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Salutation */}
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-rose-950 mb-6">
                {harshithaData.secretLetter.salutation}
              </h3>

              {/* Letter Paragraphs */}
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-stone-800 font-light">
                {harshithaData.secretLetter.paragraphs.map((para, idx) => (
                  <p key={idx} className="first-letter:text-2xl first-letter:font-serif first-letter:font-bold first-letter:text-rose-900">
                    {para}
                  </p>
                ))}
              </div>

              {/* Sign Off & Signature */}
              <div className="mt-8 pt-6 border-t border-rose-900/15 text-right space-y-1">
                <p className="text-xs font-medium italic text-stone-600">
                  {harshithaData.secretLetter.signOff}
                </p>
                <p className="font-script text-3xl sm:text-4xl text-rose-900 font-bold">
                  {harshithaData.secretLetter.author}
                </p>
              </div>

              {/* Post Script */}
              {harshithaData.secretLetter.postScript && (
                <div className="mt-6 pt-4 border-t border-dashed border-rose-900/20 text-xs italic text-rose-900/80">
                  {harshithaData.secretLetter.postScript}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
