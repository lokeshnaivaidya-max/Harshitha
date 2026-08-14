import React from 'react';
import { Heart, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { harshithaData } from '../data/harshitha';
import { soundEngine } from '../utils/sound';

export const SpecialReasonsSection: React.FC = () => {
  const handleCardClick = () => {
    soundEngine.playSparkleSound();
  };

  return (
    <section id="reasons" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-widest">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>Little Things That Make You Wonderful</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-pink-200 to-amber-200">
          Why You Are Irreplaceable
        </h2>
        <p className="text-rose-200/70 max-w-xl mx-auto text-sm sm:text-base font-light">
          Just a few of the countless reasons why the world is so much brighter with you in it.
        </p>
      </div>

      {/* Grid of 6 Reason Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {harshithaData.reasonsWhySpecial.map((reason, index) => (
          <motion.div
            key={reason.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={handleCardClick}
            className="group relative rounded-3xl glass-panel p-6 sm:p-7 border border-rose-500/20 hover:border-rose-400/50 hover:bg-rose-950/20 transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.4)] cursor-pointer hover:-translate-y-1.5"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-3xl sm:text-4xl filter drop-shadow-md group-hover:scale-125 transition-transform duration-300">
                {reason.emoji}
              </span>
              <span className="text-xs font-serif font-bold text-rose-400/40 group-hover:text-rose-400/80 transition-colors">
                #0{index + 1}
              </span>
            </div>

            <h3 className="text-xl font-serif font-bold text-rose-100 mb-2 group-hover:text-rose-300 transition-colors">
              {reason.title}
            </h3>

            <p className="text-sm text-rose-100/75 leading-relaxed font-light">
              {reason.description}
            </p>

            <div className="mt-5 pt-3 border-t border-rose-500/10 flex items-center justify-between text-xs text-rose-300/50 group-hover:text-rose-300/80 transition-colors">
              <span className="flex items-center gap-1 font-medium">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                Pure Harshitha Vibe
              </span>
              <Heart className="w-3.5 h-3.5 text-rose-400 group-hover:fill-rose-400 transition-all" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
