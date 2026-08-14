import React from 'react';
import { Sun, Heart, Quote, Calendar, Star, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import { harshithaData } from '../data/harshitha';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Sun,
  Heart,
  Star,
  Compass,
};

export const StorySection: React.FC = () => {
  return (
    <section id="story" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-widest">
          <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          <span>The Journey So Far</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-pink-200 to-amber-200">
          The Story of Harshitha
        </h2>
        <p className="text-rose-200/70 max-w-xl mx-auto text-sm sm:text-base font-light">
          A celebration of every unforgettable chapter, every loud laugh, and the beautiful soul that you are.
        </p>
      </div>

      {/* Quote Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-panel-warm rounded-3xl p-6 sm:p-8 mb-16 text-center relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
      >
        <Quote className="w-10 h-10 text-amber-400/20 mx-auto mb-3" />
        <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-rose-100 max-w-3xl mx-auto leading-relaxed">
          "{harshithaData.quote.text}"
        </p>
        <span className="inline-block mt-4 text-xs sm:text-sm font-semibold tracking-widest text-amber-300/80 uppercase">
          — {harshithaData.quote.author}
        </span>
      </motion.div>

      {/* 3 Story Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
        {harshithaData.storyChapters.map((chapter, index) => {
          const IconComponent = iconMap[chapter.iconName] || Star;
          return (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative rounded-3xl glass-panel p-6 sm:p-7 flex flex-col justify-between border border-rose-400/20 hover:border-rose-400/50 hover:bg-rose-950/20 transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.4)]"
            >
              <div>
                {/* Chapter Number Badge & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif text-3xl font-bold text-rose-400/40 group-hover:text-rose-400/70 transition-colors">
                    {chapter.number}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 border border-rose-400/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6 text-amber-300" />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-rose-100 mb-1">
                  {chapter.title}
                </h3>
                <p className="text-xs font-medium text-rose-300/60 uppercase tracking-wider mb-4">
                  {chapter.subtitle}
                </p>

                <p className="text-sm text-rose-100/75 leading-relaxed font-light">
                  {chapter.content}
                </p>
              </div>

              {/* Card Footer Highlight */}
              <div className="mt-6 pt-4 border-t border-rose-500/15 flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span className="text-xs font-semibold text-rose-200/90">
                  {chapter.highlight}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Milestones / Chapters Timeline */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-rose-500/20">
        <div className="flex items-center gap-3 mb-8">
          <Calendar className="w-5 h-5 text-rose-400" />
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-rose-100">
            Milestones of Joy
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {harshithaData.timelineMilestones.map((milestone, idx) => (
            <div
              key={idx}
              className="relative p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-rose-400/30 hover:bg-white/[0.05] transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-300 tracking-wider">
                  {milestone.year}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold uppercase">
                  {milestone.tag}
                </span>
              </div>
              <h4 className="text-base font-semibold text-rose-100 mb-1.5">
                {milestone.title}
              </h4>
              <p className="text-xs text-rose-200/70 leading-relaxed font-light">
                {milestone.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
