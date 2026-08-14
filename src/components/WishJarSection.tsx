import React, { useState, useEffect } from 'react';
import { Send, Heart, Star, Moon, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine } from '../utils/sound';
import { triggerHeartBurst } from '../utils/confetti';
import { WishItem } from '../types';

const PRESET_WISHES = [
  { text: "Boundless joy, endless laughter, and vibrant health always", tag: "Health & Joy", color: "#f43f5e" },
  { text: "Exciting travel adventures to dream destinations", tag: "Wanderlust", color: "#fbbf24" },
  { text: "Breathtaking achievements & crushing every big dream", tag: "Success", color: "#a855f7" },
  { text: "Peace of mind and cherished moments with loved ones", tag: "Serenity", color: "#06b6d4" },
];

export const WishJarSection: React.FC = () => {
  const [wishInput, setWishInput] = useState('');
  const [selectedTag, setSelectedTag] = useState('My Secret Wish');
  const [wishes, setWishes] = useState<WishItem[]>([]);
  const [animatingLantern, setAnimatingLantern] = useState<WishItem | null>(null);

  // Load local wishes on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('harshitha_wishes');
      if (saved) {
        setWishes(JSON.parse(saved));
      } else {
        // Initial warm seed wishes
        const initial: WishItem[] = [
          {
            id: 'wish-init-1',
            text: 'May this year be filled with spontaneous road trips and uncontrollable laughter!',
            date: 'Special Wish',
            tag: 'Joy',
            lanternColor: '#f43f5e',
          },
          {
            id: 'wish-init-2',
            text: 'May every step you take bring you closer to everything you desire and deserve.',
            date: 'Birthday Blessing',
            tag: 'Success',
            lanternColor: '#fbbf24',
          },
        ];
        setWishes(initial);
        localStorage.setItem('harshitha_wishes', JSON.stringify(initial));
      }
    } catch {
      // Storage fallback
    }
  }, []);

  const saveWishes = (items: WishItem[]) => {
    setWishes(items);
    try {
      localStorage.setItem('harshitha_wishes', JSON.stringify(items));
    } catch {
      // Local storage fallback
    }
  };

  const handleSendWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishInput.trim()) return;

    soundEngine.playSparkleSound();
    triggerHeartBurst();

    const colors = ['#f43f5e', '#fbbf24', '#a855f7', '#ec4899', '#38bdf8'];
    const newWish: WishItem = {
      id: `wish-${Date.now()}`,
      text: wishInput.trim(),
      date: 'Just Now',
      tag: selectedTag,
      lanternColor: colors[Math.floor(Math.random() * colors.length)],
    };

    setAnimatingLantern(newWish);
    const updated = [newWish, ...wishes];
    saveWishes(updated);
    setWishInput('');

    setTimeout(() => {
      setAnimatingLantern(null);
    }, 3500);
  };

  const handleSelectPreset = (preset: typeof PRESET_WISHES[0]) => {
    setWishInput(preset.text);
    setSelectedTag(preset.tag);
  };

  const handleDeleteWish = (id: string) => {
    const updated = wishes.filter((w) => w.id !== id);
    saveWishes(updated);
  };

  return (
    <section id="wishes" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative">
      {/* Header */}
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold uppercase tracking-widest">
          <Moon className="w-3.5 h-3.5 text-amber-300" />
          <span>The Starlight Wish Box</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-100 via-rose-200 to-amber-200">
          Make a Birthday Wish
        </h2>
        <p className="text-rose-200/70 max-w-xl mx-auto text-sm sm:text-base font-light">
          Write down your dreams, intentions, or secret hopes for the year ahead and release your glowing sky lantern into the cosmos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Wish Input */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-rose-500/20 shadow-xl relative overflow-hidden">
          <form onSubmit={handleSendWish} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-rose-300 mb-2">
                Your Birthday Wish or Intention 🏮
              </label>
              <textarea
                value={wishInput}
                onChange={(e) => setWishInput(e.target.value)}
                placeholder="Write your heartfelt wish for this year..."
                rows={4}
                className="w-full rounded-2xl bg-black/40 border border-rose-500/30 px-4 py-3 text-sm text-white placeholder-rose-200/40 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 resize-none transition"
              />
            </div>

            {/* Quick Inspiration Pills */}
            <div>
              <span className="text-[11px] font-medium text-rose-300/70 block mb-2">
                Or pick an intention:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_WISHES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-rose-200/80 hover:bg-rose-500/20 hover:border-rose-400/40 hover:text-white transition cursor-pointer"
                  >
                    {preset.tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!wishInput.trim()}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:shadow-[0_0_30px_rgba(244,63,94,0.7)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Release Wish Into The Sky 🏮</span>
            </button>
          </form>

          {/* Floating Lantern Animation */}
          {animatingLantern && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center z-30 pointer-events-none animate-fadeIn">
              <motion.div
                initial={{ y: 80, scale: 0.8, opacity: 1 }}
                animate={{ y: -160, scale: 1.2, opacity: 0 }}
                transition={{ duration: 3.2, ease: 'easeOut' }}
                className="flex flex-col items-center"
              >
                {/* Glowing Lantern */}
                <div
                  className="w-16 h-22 rounded-2xl flex items-center justify-center shadow-[0_0_40px_#fbbf24] relative border border-amber-300"
                  style={{
                    backgroundColor: animatingLantern.lanternColor,
                  }}
                >
                  <div className="w-6 h-6 bg-amber-200 rounded-full blur-sm animate-pulse" />
                  <Star className="w-5 h-5 text-amber-100 z-10" />
                </div>
                <span className="text-xs font-semibold text-amber-200 mt-2 bg-black/60 px-3 py-1 rounded-full border border-amber-400/30">
                  Wish Released 🏮
                </span>
              </motion.div>
            </div>
          )}
        </div>

        {/* Right Panel: Wish Jar Collection */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-7 border border-rose-500/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-rose-500/20 flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              </div>
              <h3 className="font-serif font-bold text-lg text-rose-100">
                Harshitha's Wish Jar
              </h3>
            </div>
            <span className="text-xs font-semibold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              {wishes.length} Wishes
            </span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            <AnimatePresence>
              {wishes.map((wish) => (
                <motion.div
                  key={wish.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-rose-400/30 transition group relative"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider text-white"
                      style={{ backgroundColor: `${wish.lanternColor}66` }}
                    >
                      {wish.tag}
                    </span>
                    <button
                      onClick={() => handleDeleteWish(wish.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-rose-400 hover:text-rose-200 transition"
                      title="Remove wish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed font-light">
                    "{wish.text}"
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
