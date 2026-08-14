import React, { useState, useEffect } from 'react';
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

function AppContent() {
  const { isAdminOpen, setIsAdminOpen } = usePhotoContext();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      setCurrentPath(path);
      setCurrentHash(hash);

      if (
        path === '/admin' ||
        path.startsWith('/admin/') ||
        hash === '#admin' ||
        hash.startsWith('#admin') ||
        search.includes('admin')
      ) {
        setIsAdminOpen(true);
      }
    };

    // Keyboard shortcut (Alt+A or Ctrl+Shift+A or Cmd+Shift+A) to quickly access admin panel
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.altKey && (e.key === 'a' || e.key === 'A')) ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A'))
      ) {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };

    // Expose helper on window for convenience
    (window as any).openAdmin = () => setIsAdminOpen(true);

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setIsAdminOpen]);

  const isAdminRoute =
    currentPath === '/admin' || currentPath.startsWith('/admin/') || currentHash === '#admin';

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

      {/* Admin Photo Management Modal (Accessible via /admin or #admin) */}
      {(isAdminOpen || isAdminRoute) && <AdminPanelModal />}

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
