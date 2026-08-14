import React, { createContext, useContext, useState, useEffect } from 'react';
import { PhotoMemory, harshithaData } from '../data/harshitha';
import {
  getStoredPhotos,
  saveStoredPhotos,
  getStoredHeroPhoto,
  saveStoredHeroPhoto,
  clearAllStoredData,
  fileToDataUrl,
} from '../utils/photoStorage';
import { soundEngine } from '../utils/sound';

export interface AddPhotoPayload {
  file: File;
  title: string;
  caption: string;
  category: 'all' | 'adventures' | 'smiles' | 'special' | 'candid';
  date?: string;
  location?: string;
  setAsHero?: boolean;
}

interface PhotoContextType {
  photos: PhotoMemory[];
  heroPhoto: string;
  isLoading: boolean;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  addPhotos: (payloads: AddPhotoPayload[]) => Promise<boolean>;
  updatePhoto: (id: string, updates: Partial<PhotoMemory>) => Promise<boolean>;
  deletePhoto: (id: string) => Promise<boolean>;
  setHeroPhotoFromUrl: (url: string) => Promise<boolean>;
  resetHeroPhoto: () => Promise<boolean>;
  reorderPhotos: (newPhotos: PhotoMemory[]) => Promise<boolean>;
  resetAllPhotosToDefault: () => Promise<boolean>;
  exportBackupJSON: () => string;
  importBackupJSON: (jsonStr: string) => Promise<boolean>;
  customPhotoCount: number;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const PhotoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<PhotoMemory[]>(harshithaData.photoGallery);
  const [heroPhoto, setHeroPhoto] = useState<string>(harshithaData.hero.heroPhoto);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Initialize data from IndexedDB
  useEffect(() => {
    async function loadData() {
      try {
        const storedPhotos = await getStoredPhotos();
        if (storedPhotos && storedPhotos.length > 0) {
          setPhotos(storedPhotos);
        }

        const storedHero = await getStoredHeroPhoto();
        if (storedHero) {
          setHeroPhoto(storedHero);
        }
      } catch (err) {
        console.error('Failed to load photos from IndexedDB:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Add one or multiple photos (supports large files >5MB via FileReader -> DataURL / IndexedDB)
  const addPhotos = async (payloads: AddPhotoPayload[]): Promise<boolean> => {
    try {
      const newItems: PhotoMemory[] = [];
      let latestHero: string | null = null;

      for (let i = 0; i < payloads.length; i++) {
        const item = payloads[i];
        const dataUrl = await fileToDataUrl(item.file);
        const randomRotation = (Math.random() * 6 - 3); // between -3 and +3 deg
        
        const newPhoto: PhotoMemory = {
          id: `custom-photo-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
          url: dataUrl,
          title: item.title.trim() || item.file.name.replace(/\.[^/.]+$/, ""),
          caption: item.caption.trim() || 'A beautiful memory with Harshitha.',
          category: item.category || 'smiles',
          date: item.date || 'Special Memory',
          location: item.location || 'Everywhere with You',
          rotation: Math.round(randomRotation),
        };

        newItems.push(newPhoto);

        if (item.setAsHero) {
          latestHero = dataUrl;
        }
      }

      // Prepend or append new photos
      const updatedPhotos = [...newItems, ...photos];
      setPhotos(updatedPhotos);
      await saveStoredPhotos(updatedPhotos);

      if (latestHero) {
        setHeroPhoto(latestHero);
        await saveStoredHeroPhoto(latestHero);
      }

      soundEngine.playSparkleSound();
      return true;
    } catch (err) {
      console.error('Error adding photos:', err);
      return false;
    }
  };

  // Update existing photo details
  const updatePhoto = async (id: string, updates: Partial<PhotoMemory>): Promise<boolean> => {
    try {
      const updated = photos.map((p) => (p.id === id ? { ...p, ...updates } : p));
      setPhotos(updated);
      await saveStoredPhotos(updated);
      return true;
    } catch {
      return false;
    }
  };

  // Delete photo
  const deletePhoto = async (id: string): Promise<boolean> => {
    try {
      const updated = photos.filter((p) => p.id !== id);
      setPhotos(updated);
      await saveStoredPhotos(updated);
      return true;
    } catch {
      return false;
    }
  };

  // Set hero photo
  const setHeroPhotoFromUrl = async (url: string): Promise<boolean> => {
    try {
      setHeroPhoto(url);
      await saveStoredHeroPhoto(url);
      return true;
    } catch {
      return false;
    }
  };

  // Reset hero photo to default
  const resetHeroPhoto = async (): Promise<boolean> => {
    try {
      setHeroPhoto(harshithaData.hero.heroPhoto);
      await saveStoredHeroPhoto(harshithaData.hero.heroPhoto);
      return true;
    } catch {
      return false;
    }
  };

  // Reorder photos
  const reorderPhotos = async (newPhotos: PhotoMemory[]): Promise<boolean> => {
    try {
      setPhotos(newPhotos);
      await saveStoredPhotos(newPhotos);
      return true;
    } catch {
      return false;
    }
  };

  // Reset everything to defaults
  const resetAllPhotosToDefault = async (): Promise<boolean> => {
    try {
      await clearAllStoredData();
      setPhotos(harshithaData.photoGallery);
      setHeroPhoto(harshithaData.hero.heroPhoto);
      return true;
    } catch {
      return false;
    }
  };

  // Export as JSON backup string
  const exportBackupJSON = (): string => {
    const data = {
      heroPhoto,
      photos,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  };

  // Import from JSON backup string
  const importBackupJSON = async (jsonStr: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed.photos)) {
        setPhotos(parsed.photos);
        await saveStoredPhotos(parsed.photos);
      }
      if (parsed.heroPhoto && typeof parsed.heroPhoto === 'string') {
        setHeroPhoto(parsed.heroPhoto);
        await saveStoredHeroPhoto(parsed.heroPhoto);
      }
      return true;
    } catch (err) {
      console.error('Failed to import backup:', err);
      return false;
    }
  };

  const customPhotoCount = photos.filter((p) => p.id.startsWith('custom-photo-')).length;

  return (
    <PhotoContext.Provider
      value={{
        photos,
        heroPhoto,
        isLoading,
        isAdminOpen,
        setIsAdminOpen,
        addPhotos,
        updatePhoto,
        deletePhoto,
        setHeroPhotoFromUrl,
        resetHeroPhoto,
        reorderPhotos,
        resetAllPhotosToDefault,
        exportBackupJSON,
        importBackupJSON,
        customPhotoCount,
      }}
    >
      {children}
    </PhotoContext.Provider>
  );
};

export const usePhotoContext = () => {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error('usePhotoContext must be used within a PhotoProvider');
  }
  return context;
};
