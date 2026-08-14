import React, { useState } from 'react';
import { Camera, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PhotoMemory } from '../data/harshitha';
import { PhotoLightbox } from './PhotoLightbox';
import { usePhotoContext } from '../context/PhotoContext';
import { soundEngine } from '../utils/sound';

export const PhotoGallery: React.FC = () => {
  const { photos } = usePhotoContext();
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMemory | null>(null);

  const handlePhotoClick = (photo: PhotoMemory) => {
    soundEngine.playSparkleSound();
    setSelectedPhoto(photo);
  };

  return (
    <section id="gallery" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-widest">
          <Camera className="w-3.5 h-3.5 text-rose-400" />
          <span>Cherished Moments</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-pink-200 to-amber-200">
          Gallery
        </h2>
        <p className="text-rose-200/70 max-w-xl mx-auto text-sm sm:text-base font-light">
          A timeless collection of unforgettable memories and special moments with Harshitha.
        </p>
      </div>

      {/* Polaroid Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <AnimatePresence mode="popLayout">
          {photos.map((photo, idx) => {
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
                      alt={photo.caption || 'Harshitha memory'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/harshitha/photo1.svg';
                      }}
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                      <div className="w-10 h-10 rounded-full bg-rose-500/80 backdrop-blur-md flex items-center justify-center text-white shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Only Caption (No File Name / Title) */}
                  <div className="mt-3.5 px-1 text-center">
                    <p className="text-xs sm:text-sm text-rose-100 font-light leading-snug line-clamp-2">
                      {photo.caption || 'A memorable moment with Harshitha.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <PhotoLightbox
          photo={selectedPhoto}
          photos={photos}
          onClose={() => setSelectedPhoto(null)}
          onSelectPhoto={(photo) => setSelectedPhoto(photo)}
        />
      )}
    </section>
  );
};
