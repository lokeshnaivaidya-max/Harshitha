import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Heart, Menu, X, Music, Cake, Camera, BookOpen, Mail, PartyPopper, ImagePlus } from 'lucide-react';
import { soundEngine } from '../utils/sound';
import { triggerBirthdayConfetti } from '../utils/confetti';
import { harshithaData } from '../data/harshitha';
import { usePhotoContext } from '../context/PhotoContext';

export const Navbar: React.FC = () => {
  const { setIsAdminOpen, customPhotoCount } = usePhotoContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsub = soundEngine.subscribe((playing) => {
      setIsPlaying(playing);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      unsub();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMusicToggle = () => {
    soundEngine.toggleMusic();
  };

  const handleCelebrateClick = () => {
    soundEngine.playSparkleSound();
    triggerBirthdayConfetti();
  };

  const navLinks = [
    { label: 'Our Story', href: '#story', icon: BookOpen },
    { label: 'Gallery', href: '#gallery', icon: Camera },
    { label: 'Birthday Cake', href: '#cake', icon: Cake },
    { label: 'Why You', href: '#reasons', icon: Heart },
    { label: 'Secret Letter', href: '#letter', icon: Mail },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0c0910]/85 backdrop-blur-xl border-b border-rose-500/20 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent py-5'
      }`}
      id="main-navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#top"
          className="group flex items-center gap-2.5 text-inherit no-underline"
          id="nav-brand"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 p-[1.5px] transition-transform group-hover:scale-110">
            <div className="w-full h-full rounded-full bg-[#120a17] flex items-center justify-center">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-500/40 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg md:text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-100 to-amber-200">
              {harshithaData.name}
            </span>
            <span className="text-[10px] tracking-widest uppercase text-rose-300/60 font-medium">
              Birthday Edition
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium text-rose-100/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Actions: Photo Admin, Music Player & Celebrate Button */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Photo Admin Trigger */}
          <button
            onClick={() => setIsAdminOpen(true)}
            id="nav-admin-toggle"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-500/15 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 hover:border-rose-400/60 transition-all duration-200 cursor-pointer"
            title="Open Photo Admin to add Harshitha's pictures"
          >
            <ImagePlus className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Add Pics</span>
            {customPhotoCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {customPhotoCount}
              </span>
            )}
          </button>

          {/* Music Player Button */}
          <button
            onClick={handleMusicToggle}
            id="nav-music-toggle"
            className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
              isPlaying
                ? 'bg-rose-500/20 text-rose-200 border border-rose-400/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                : 'bg-white/5 text-rose-300/60 hover:text-rose-200 border border-white/10 hover:bg-white/10'
            }`}
            title={isPlaying ? 'Pause Music' : 'Play Birthday Music'}
          >
            {isPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Music</span>
                {/* Audio Equalizer animation bars */}
                <div className="flex items-end gap-0.5 h-3 ml-0.5">
                  <span className="w-0.5 bg-rose-400 h-full animate-[bounce_0.6s_infinite_ease-in-out]" />
                  <span className="w-0.5 bg-rose-400 h-2/3 animate-[bounce_0.9s_infinite_ease-in-out_0.2s]" />
                  <span className="w-0.5 bg-rose-400 h-4/5 animate-[bounce_0.7s_infinite_ease-in-out_0.1s]" />
                </div>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Music</span>
              </>
            )}
          </button>

          {/* Celebrate Confetti 3D Popper Button */}
          <button
            onClick={handleCelebrateClick}
            id="nav-celebrate-btn"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white shadow-[0_2px_12px_rgba(244,63,94,0.4)] hover:shadow-[0_4px_20px_rgba(244,63,94,0.6)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <PartyPopper className="w-3.5 h-3.5" />
            <span>Celebrate 🎉</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/5 text-rose-200 border border-white/10 hover:bg-white/10 transition"
            aria-label="Toggle menu"
            id="nav-mobile-toggle"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-rose-500/20 px-4 py-4 mt-3 space-y-2 animate-fadeIn">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-100/90 hover:bg-rose-500/20 hover:text-white transition"
              >
                <Icon className="w-4 h-4 text-rose-400" />
                <span>{link.label}</span>
              </a>
            );
          })}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setIsAdminOpen(true);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-200 bg-rose-500/20 hover:bg-rose-500/30 transition text-left"
          >
            <ImagePlus className="w-4 h-4 text-rose-400" />
            <span>Add Photos of Harshitha (Admin)</span>
          </button>
        </div>
      )}
    </nav>
  );
};
