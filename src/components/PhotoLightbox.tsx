import React, { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, MapPin, Calendar, Heart, Share2 } from 'lucide-react';
import { PhotoMemory } from '../data/harshitha';
import { soundEngine } from '../utils/sound';

interface PhotoLightboxProps {
  photo: PhotoMemory | null;
  photos: PhotoMemory[];
  onClose: () => void;
  onSelectPhoto: (photo: PhotoMemory) => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  photo,
  photos,
  onClose,
  onSelectPhoto,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [liked, setLiked] = useState(false);

  const currentIndex = photo ? photos.findIndex((p) => p.id === photo.id) : -1;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      soundEngine.playSparkleSound();
      setIsZoomed(false);
      onSelectPhoto(photos[currentIndex - 1]);
    } else if (photos.length > 0) {
      soundEngine.playSparkleSound();
      setIsZoomed(false);
      onSelectPhoto(photos[photos.length - 1]);
    }
  }, [currentIndex, photos, onSelectPhoto]);

  const handleNext = useCallback(() => {
    if (currentIndex < photos.length - 1) {
      soundEngine.playSparkleSound();
      setIsZoomed(false);
      onSelectPhoto(photos[currentIndex + 1]);
    } else if (photos.length > 0) {
      soundEngine.playSparkleSound();
      setIsZoomed(false);
      onSelectPhoto(photos[0]);
    }
  }, [currentIndex, photos, onSelectPhoto]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, handlePrev, handleNext]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 sm:p-6 md:p-10 animate-fadeIn"
      onClick={onClose}
      id="photo-lightbox-modal"
    >
      {/* Top Bar Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium text-rose-200">
          <span>
            {currentIndex + 1} / {photos.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(!isZoomed);
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title={isZoomed ? 'Zoom Out' : 'Zoom In'}
          >
            {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          </button>

          {/* Heart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
              soundEngine.playSparkleSound();
            }}
            className={`p-2 rounded-full transition cursor-pointer ${
              liked ? 'bg-rose-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title="Love this memory"
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-white' : ''}`} />
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white transition shadow-lg cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-rose-500/80 text-white backdrop-blur-md border border-white/15 transition-all duration-200 z-20 cursor-pointer shadow-xl hover:scale-110"
        title="Previous Photo"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-rose-500/80 text-white backdrop-blur-md border border-white/15 transition-all duration-200 z-20 cursor-pointer shadow-xl hover:scale-110"
        title="Next Photo"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Lightbox Content Container */}
      <div
        className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center justify-center pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Photo Container */}
        <div
          className={`relative rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-rose-500/30 transition-all duration-300 ${
            isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <img
            src={photo.url}
            alt={photo.title}
            className="max-h-[62vh] sm:max-h-[68vh] w-auto max-w-full object-contain mx-auto"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/harshitha/photo1.svg';
            }}
          />
        </div>

        {/* Caption & Metadata Card below image */}
        <div className="mt-4 p-4 rounded-2xl bg-[#160f22]/90 backdrop-blur-xl border border-rose-500/20 max-w-xl w-full text-center space-y-2">
          <p className="text-base sm:text-lg text-rose-100 font-light leading-relaxed">
            {photo.caption || 'A beautiful memory with Harshitha.'}
          </p>

          <div className="flex items-center justify-center gap-4 pt-1 text-xs text-rose-300/60 font-medium">
            {photo.date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                {photo.date}
              </span>
            )}
            {photo.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                {photo.location}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
