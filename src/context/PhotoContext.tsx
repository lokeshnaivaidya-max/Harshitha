import React, { createContext, useContext, useState, useEffect } from 'react';
import { PhotoMemory, harshithaData } from '../data/harshitha';
import {
  fileToDataUrl,
  subscribeToFirebaseGallery,
  getFirebasePhotos,
  getFirebaseHeroPhoto,
  savePhotosToFirebase,
  updatePhotoInFirebase,
  deletePhotoFromFirebase,
  saveHeroPhotoToFirebase,
  clearAllFirebaseData,
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
  addPhotos: (payloads: AddPhotoPayload[], replaceTemplates?: boolean) => Promise<boolean>;
  replacePhotoSlot: (id: string, file: File, meta?: Partial<PhotoMemory>) => Promise<boolean>;
  updatePhoto: (id: string, updates: Partial<PhotoMemory>) => Promise<boolean>;
  deletePhoto: (id: string) => Promise<boolean>;
  setHeroPhotoFromUrl: (url: string) => Promise<boolean>;
  setHeroPhotoFromFile: (file: File) => Promise<boolean>;
  resetHeroPhoto: () => Promise<boolean>;
  reorderPhotos: (newPhotos: PhotoMemory[]) => Promise<boolean>;
  resetAllPhotosToDefault: () => Promise<boolean>;
  exportBackupJSON: () => string;
  importBackupJSON: (jsonStr: string) => Promise<boolean>;
  customPhotoCount: number;
  templatePlaceholderCount: number;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const PhotoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<PhotoMemory[]>(harshithaData.photoGallery);
  const [heroPhoto, setHeroPhoto] = useState<string>(harshithaData.hero.heroPhoto);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Initialize data from Firebase Firestore and subscribe to real-time updates
  useEffect(() => {
    let isMounted = true;

    async function initFirebaseData() {
      try {
        const [cloudPhotos, cloudHero] = await Promise.all([
          getFirebasePhotos(),
          getFirebaseHeroPhoto(),
        ]);

        if (isMounted) {
          if (cloudPhotos && cloudPhotos.length > 0) {
            setPhotos(cloudPhotos);
          }
          if (cloudHero) {
            setHeroPhoto(cloudHero);
          }
        }
      } catch (err) {
        console.error('Failed to fetch initial Firebase photos:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initFirebaseData();

    // Subscribe to real-time cloud updates across all devices
    const unsubscribe = subscribeToFirebaseGallery(
      (updatedPhotos) => {
        if (isMounted && updatedPhotos && updatedPhotos.length > 0) {
          setPhotos(updatedPhotos);
        }
      },
      (updatedHero) => {
        if (isMounted && updatedHero) {
          setHeroPhoto(updatedHero);
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Helper to check if a photo is an unreplaced default template
  const isDefaultTemplate = (p: PhotoMemory) => {
    return p.id.startsWith('photo-') && p.url.startsWith('/images/');
  };

  // Add photos with option to replace default placeholders in order or append
  const addPhotos = async (payloads: AddPhotoPayload[], replaceTemplates = true): Promise<boolean> => {
    try {
      if (payloads.length === 0) return true;

      const newItems: PhotoMemory[] = [];
      let latestHero: string | null = null;

      for (let i = 0; i < payloads.length; i++) {
        const item = payloads[i];
        const dataUrl = await fileToDataUrl(item.file);
        const randomRotation = Math.round(Math.random() * 6 - 3);

        const newPhoto: PhotoMemory = {
          id: `custom-photo-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
          url: dataUrl,
          title: item.title.trim() || item.file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          caption: item.caption.trim() || 'A beautiful memory with Harshitha.',
          category: item.category || 'smiles',
          date: item.date || 'Special Memory',
          location: item.location || 'Everywhere with You',
          rotation: randomRotation,
        };

        newItems.push(newPhoto);

        if (item.setAsHero) {
          latestHero = dataUrl;
        }
      }

      let updatedPhotos: PhotoMemory[] = [];

      if (replaceTemplates) {
        // If we have default template placeholders, replace them in place!
        const currentPhotos = [...photos];
        let newItemsIndex = 0;

        for (let i = 0; i < currentPhotos.length && newItemsIndex < newItems.length; i++) {
          if (isDefaultTemplate(currentPhotos[i])) {
            currentPhotos[i] = {
              ...newItems[newItemsIndex],
              category: newItems[newItemsIndex].category || currentPhotos[i].category,
              rotation: currentPhotos[i].rotation,
            };
            newItemsIndex++;
          }
        }

        // If there are leftover new items after replacing all placeholders, prepend them
        const remainingNewItems = newItems.slice(newItemsIndex);
        updatedPhotos = [...remainingNewItems, ...currentPhotos];
      } else {
        // Append mode
        updatedPhotos = [...newItems, ...photos];
      }

      setPhotos(updatedPhotos);

      const targetHero = latestHero || heroPhoto;
      if (latestHero) {
        setHeroPhoto(latestHero);
      }

      // Persist to Firebase Firestore database
      await savePhotosToFirebase(updatedPhotos, targetHero);

      soundEngine.playSparkleSound();
      return true;
    } catch (err) {
      console.error('Error adding photos:', err);
      return false;
    }
  };

  // Replace a specific photo slot
  const replacePhotoSlot = async (id: string, file: File, meta?: Partial<PhotoMemory>): Promise<boolean> => {
    try {
      const dataUrl = await fileToDataUrl(file);
      const updatedPhotos = photos.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            url: dataUrl,
            title: meta?.title?.trim() || p.title || file.name.replace(/\.[^/.]+$/, ''),
            caption: meta?.caption?.trim() || p.caption,
            category: meta?.category || p.category,
            date: meta?.date || p.date || 'Special Memory',
            location: meta?.location || p.location || 'With Harshitha',
          };
        }
        return p;
      });

      setPhotos(updatedPhotos);
      await savePhotosToFirebase(updatedPhotos, heroPhoto);

      soundEngine.playSparkleSound();
      return true;
    } catch (err) {
      console.error('Failed to replace photo slot:', err);
      return false;
    }
  };

  // Set hero directly from file
  const setHeroPhotoFromFile = async (file: File): Promise<boolean> => {
    try {
      const dataUrl = await fileToDataUrl(file);
      setHeroPhoto(dataUrl);
      await saveHeroPhotoToFirebase(dataUrl);

      soundEngine.playSparkleSound();
      return true;
    } catch (err) {
      console.error('Failed to update hero photo:', err);
      return false;
    }
  };

  // Update existing photo details
  const updatePhoto = async (id: string, updates: Partial<PhotoMemory>): Promise<boolean> => {
    try {
      const target = photos.find((p) => p.id === id);
      if (target) {
        const updatedPhoto = { ...target, ...updates };
        const updatedList = photos.map((p) => (p.id === id ? updatedPhoto : p));
        setPhotos(updatedList);
        await updatePhotoInFirebase(updatedPhoto);
      }
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
      await deletePhotoFromFirebase(id);
      return true;
    } catch {
      return false;
    }
  };

  // Set hero photo from URL
  const setHeroPhotoFromUrl = async (url: string): Promise<boolean> => {
    try {
      setHeroPhoto(url);
      await saveHeroPhotoToFirebase(url);
      return true;
    } catch {
      return false;
    }
  };

  // Reset hero photo to default
  const resetHeroPhoto = async (): Promise<boolean> => {
    try {
      setHeroPhoto(harshithaData.hero.heroPhoto);
      await saveHeroPhotoToFirebase(harshithaData.hero.heroPhoto);
      return true;
    } catch {
      return false;
    }
  };

  // Reorder photos
  const reorderPhotos = async (newPhotos: PhotoMemory[]): Promise<boolean> => {
    try {
      setPhotos(newPhotos);
      await savePhotosToFirebase(newPhotos, heroPhoto);
      return true;
    } catch {
      return false;
    }
  };

  // Reset everything to defaults
  const resetAllPhotosToDefault = async (): Promise<boolean> => {
    try {
      await clearAllFirebaseData();
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
      let newPhotos = photos;
      let newHero = heroPhoto;

      if (Array.isArray(parsed.photos)) {
        newPhotos = parsed.photos;
        setPhotos(parsed.photos);
      }
      if (parsed.heroPhoto && typeof parsed.heroPhoto === 'string') {
        newHero = parsed.heroPhoto;
        setHeroPhoto(parsed.heroPhoto);
      }
      await savePhotosToFirebase(newPhotos, newHero);
      return true;
    } catch (err) {
      console.error('Failed to import backup:', err);
      return false;
    }
  };

  const customPhotoCount = photos.filter((p) => !isDefaultTemplate(p)).length;
  const templatePlaceholderCount = photos.filter((p) => isDefaultTemplate(p)).length;

  return (
    <PhotoContext.Provider
      value={{
        photos,
        heroPhoto,
        isLoading,
        isAdminOpen,
        setIsAdminOpen,
        addPhotos,
        replacePhotoSlot,
        setHeroPhotoFromFile,
        updatePhoto,
        deletePhoto,
        setHeroPhotoFromUrl,
        resetHeroPhoto,
        reorderPhotos,
        resetAllPhotosToDefault,
        exportBackupJSON,
        importBackupJSON,
        customPhotoCount,
        templatePlaceholderCount,
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
