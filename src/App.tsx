import React from 'react';
import { CustomCursor } from './components/CustomCursor';
import { BackgroundStars } from './components/BackgroundStars';
import { FloatingBalloons } from './components/FloatingBalloons';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StorySection } from './components/StorySection';
import { PhotoGallery } from './components/PhotoGallery';
import { InteractiveCake } from './components/InteractiveCake';
import { SpecialReasonsSection } from './components/SpecialReasonsSection';
import { WishJarSection } from './components/WishJarSection';
import { SecretLetterSection } from './components/SecretLetterSection';
import { Footer } from './components/Footer';
import { PhotoProvider, usePhotoContext } from './context/PhotoContext';
import { AdminPanelModal } from './components/AdminPanelModal';
import { ImagePlus } from 'lucide-react';

function AppContent() {
  const { setIsAdminOpen, customPhotoCount } = usePhotoContext();

  return (
    <div className="relative min-h-screen bg-[#0c0910] text-[#f8f5f0] overflow-x-hidden selection:bg-rose-500/30 selection:text-rose-200">
      {/* Interactive Desktop Custom Cursor */}
      <CustomCursor />

      {/* Deep Space Glowing Stars and Nebulas */}
      <BackgroundStars />

      {/* Floating Interactive Birthday Balloons (click/tap to pop) */}
      <FloatingBalloons />

      {/* Top Floating Glass Navigation with Music Player & Controls */}
      <Navbar />

      {/* Main Experience Flow */}
      <main className="relative z-10">
        {/* 1. Hero Birthday Spotlight */}
        <HeroSection />

        {/* 2. Harshitha's Story, Chapters & Journey Timeline */}
        <StorySection />

        {/* 3. Memory Photo Gallery & Interactive Lightbox */}
        <PhotoGallery />

        {/* 4. Interactive Cake Cutting & Candle Blowing Ritual */}
        <InteractiveCake />

        {/* 5. Special Traits & Reasons Why You Are Loved */}
        <SpecialReasonsSection />

        {/* 6. Starlight Wish Jar & Glowing Sky Lanterns */}
        <WishJarSection />

        {/* 7. Wax-Sealed Private Birthday Letter */}
        <SecretLetterSection />
      </main>

      {/* Floating Quick-Access Admin Photo Manager Button */}
      <button
        onClick={() => setIsAdminOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-medium text-xs sm:text-sm shadow-[0_4px_25px_rgba(244,63,94,0.5)] border border-rose-300/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        title="Add & Manage Harshitha's Photos (>5MB supported)"
        id="floating-admin-btn"
      >
        <ImagePlus className="w-4 h-4 text-white" />
        <span className="font-semibold">Photo Admin</span>
        {customPhotoCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-white text-rose-600 text-[10px] font-bold flex items-center justify-center">
            {customPhotoCount}
          </span>
        )}
      </button>

      {/* Admin Photo Management Modal (Drag & Drop, >5MB support, IndexedDB storage) */}
      <AdminPanelModal />

      {/* Footer with Celebration Fireworks & Back to Top */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <PhotoProvider>
      <AppContent />
    </PhotoProvider>
  );
}
