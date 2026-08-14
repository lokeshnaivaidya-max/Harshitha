import React, { useState, useRef } from 'react';
import { Camera, Heart, Eye, Filter, Info, Plus, Upload, Check, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PhotoMemory } from '../data/harshitha';
import { PhotoLightbox } from './PhotoLightbox';
import { usePhotoContext } from '../context/PhotoContext';
import { soundEngine } from '../utils/sound';

type CategoryFilter = 'all' | 'smiles' | 'adventures' | 'candid' | 'special';

export const PhotoGallery: React.FC = () => {
  const { photos, setIsAdminOpen, customPhotoCount, replacePhotoSlot } = usePhotoContext();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMemory | null>(null);
  const [uploadingSlotId, setUploadingSlotId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const targetSlotRef = useRef<string | null>(null);

  const categories: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'All Moments 📸' },
    { id: 'smiles', label: 'Radiant Smiles 😊' },
    { id: 'adventures', label: 'Adventures 🗺️' },
    { id: 'candid', label: 'Candid Laughs 💖' },
    { id: 'special', label: 'Special Occasions 👑' },
  ];

  const filteredPhotos = activeCategory === 'all'
    ? photos
    : photos.filter((p) => p.category === activeCategory);

  const handlePhotoClick = (photo: PhotoMemory) => {
    soundEngine.playSparkleSound();
    setSelectedPhoto(photo);
  };

  const handleTriggerSlotUpload = (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation();
    targetSlotRef.current = photoId;
    fileInputRef.current?.click();
  };

  const handleSlotFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && targetSlotRef.current) {
      const file = e.target.files[0];
      const slotId = targetSlotRef.current;
      setUploadingSlotId(slotId);
      try {
        await replacePhotoSlot(slotId, file);
      } finally {
        setUploadingSlotId(null);
        targetSlotRef.current = null;
        e.target.value = '';
      }
    }
  };

  return (
    <section id="gallery" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hidden File Input for quick 1-click slot replacement */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleSlotFileSelected}
        className="hidden"
      />

      {/* Section Header */}
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-widest">
          <Camera className="w-3.5 h-3.5 text-rose-400" />
          <span>Cherished Moments</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-pink-200 to-amber-200">
          Memory Gallery
        </h2>
        <p className="text-rose-200/70 max-w-xl mx-auto text-sm sm:text-base font-light">
          A timeless collection of unforgettable smiles, spontaneous adventures, and favorite moments.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setIsAdminOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.35)] hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Upload Harshitha's Photos</span>
            {customPhotoCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
                {customPhotoCount} Added
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              soundEngine.playSparkleSound();
              setActiveCategory(cat.id);
            }}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] scale-105'
                : 'bg-white/5 text-rose-200/70 border border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Polaroid Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <AnimatePresence mode="popLayout">
          {filteredPhotos.map((photo, idx) => {
            const isTemplate = photo.id.startsWith('photo-') && photo.url.startsWith('/images/');
            const isUploading = uploadingSlotId === photo.id;

            return (
              <motion.div
                layout
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => handlePhotoClick(photo)}
                className="group cursor-pointer"
              >
                {/* Polaroid Frame */}
                <div
                  className="relative bg-[#1c1426] border border-rose-500/20 rounded-2xl p-3 sm:p-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(244,63,94,0.25)] group-hover:border-rose-400/50"
                  style={{
                    transform: `rotate(${photo.rotation || 0}deg)`,
                  }}
                >
                  {/* Vintage Tape on Polaroid */}
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-sm pointer-events-none" />

                  {/* Photo Frame Container */}
                  <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-black/40 border border-white/5">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/harshitha/photo1.svg';
                      }}
                    />

                    {/* Template Indicator or Custom Badge */}
                    <div className="absolute top-2 left-2 flex items-center gap-1 z-10 pointer-events-none">
                      {isTemplate ? (
                        <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-amber-200 text-[10px] font-medium border border-amber-400/30">
                          Template Slot
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/80 backdrop-blur-md text-white text-[10px] font-medium">
                          ⭐ Saved Photo
                        </span>
                      )}
                    </div>

                    {/* Direct "Change Image" Button in Card */}
                    <div className="absolute top-2 right-2 z-20">
                      <button
                        onClick={(e) => handleTriggerSlotUpload(e, photo.id)}
                        className="px-2.5 py-1 rounded-full bg-black/70 hover:bg-rose-500 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20 shadow-md transition-all duration-200 flex items-center gap-1 cursor-pointer opacity-90 group-hover:opacity-100 hover:scale-105"
                        title="Upload your photo to this frame"
                      >
                        {isUploading ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <Upload className="w-3 h-3 text-amber-300" />
                        )}
                        <span>{isTemplate ? 'Add Pic' : 'Change'}</span>
                      </button>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                      <div className="w-10 h-10 rounded-full bg-rose-500/80 backdrop-blur-md flex items-center justify-center text-white shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Caption / Title */}
                  <div className="mt-3.5 px-1 space-y-1 text-center">
                    <h4 className="font-serif font-semibold text-rose-100 text-base group-hover:text-rose-300 transition-colors truncate">
                      {photo.title}
                    </h4>
                    <p className="text-xs text-rose-200/60 line-clamp-1 font-light">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Information Tip */}
      <div className="mt-14 p-4 rounded-2xl glass-panel border border-rose-500/15 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-rose-300/80">
        <div className="flex items-center gap-3">
          <Info className="w-4 h-4 text-amber-300 shrink-0" />
          <span>
            Click <strong>"Add Pic"</strong> on any frame or open <strong>Photo Admin</strong> to replace template slots with your real photos!
          </span>
        </div>
        <button
          onClick={() => setIsAdminOpen(true)}
          className="px-4 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-semibold text-xs shrink-0 cursor-pointer border border-rose-400/30"
        >
          Open Admin Panel
        </button>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <PhotoLightbox
          photo={selectedPhoto}
          photos={filteredPhotos}
          onClose={() => setSelectedPhoto(null)}
          onSelectPhoto={(photo) => setSelectedPhoto(photo)}
        />
      )}
    </section>
  );
};
