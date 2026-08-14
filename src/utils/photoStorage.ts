import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  writeBatch,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase';
import { PhotoMemory } from '../data/harshitha';

const STORE_PHOTOS_COLLECTION = 'gallery_photos';
const STORE_SETTINGS_COLLECTION = 'app_settings';
const LOCAL_STORAGE_PHOTOS_KEY = 'harshitha_saved_photos';
const LOCAL_STORAGE_HERO_KEY = 'harshitha_saved_hero';

// Convert a large File (>5MB) to high-quality Data URL with smart compression
export function fileToDataUrl(file: File, maxDimension = 1440, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawResult = e.target?.result as string;
      if (!rawResult) {
        reject(new Error('Failed to read file'));
        return;
      }

      if (file.type === 'image/svg+xml' || (file.size < 150 * 1024 && rawResult.length < 200 * 1024)) {
        resolve(rawResult);
        return;
      }

      // Optimize raster images using Canvas
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(rawResult);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        try {
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(optimizedDataUrl);
        } catch {
          resolve(rawResult);
        }
      };
      img.onerror = () => resolve(rawResult);
      img.src = rawResult;
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Format file size helper
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Subscribe to real-time updates from Firebase Firestore
export function subscribeToFirebaseGallery(
  onPhotosChange: (photos: PhotoMemory[]) => void,
  onHeroChange: (heroPhoto: string) => void
): Unsubscribe {
  const unsubPhotos = onSnapshot(
    collection(db, STORE_PHOTOS_COLLECTION),
    (snapshot) => {
      if (!snapshot.empty) {
        const loadedPhotos: PhotoMemory[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as PhotoMemory & { orderIndex?: number };
          loadedPhotos.push(data);
        });
        // Sort by orderIndex or maintain stable order
        loadedPhotos.sort((a, b) => {
          const idxA = (a as any).orderIndex ?? 0;
          const idxB = (b as any).orderIndex ?? 0;
          return idxA - idxB;
        });
        onPhotosChange(loadedPhotos);
      }
    },
    (err) => {
      console.warn('Firebase snapshot listener error:', err);
    }
  );

  const unsubHero = onSnapshot(
    doc(db, STORE_SETTINGS_COLLECTION, 'hero_photo'),
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && data.value) {
          onHeroChange(data.value);
        }
      }
    },
    (err) => {
      console.warn('Firebase hero snapshot error:', err);
    }
  );

  return () => {
    unsubPhotos();
    unsubHero();
  };
}

// Fetch all photos from Firebase Firestore
export async function getFirebasePhotos(): Promise<PhotoMemory[] | null> {
  try {
    const snap = await getDocs(collection(db, STORE_PHOTOS_COLLECTION));
    if (!snap.empty) {
      const photos: PhotoMemory[] = [];
      snap.forEach((docSnap) => {
        photos.push(docSnap.data() as PhotoMemory);
      });
      photos.sort((a, b) => {
        const idxA = (a as any).orderIndex ?? 0;
        const idxB = (b as any).orderIndex ?? 0;
        return idxA - idxB;
      });
      return photos;
    }
  } catch (err) {
    console.warn('Firebase getDocs error, falling back to local:', err);
  }
  return null;
}

// Fetch custom hero photo from Firebase Firestore
export async function getFirebaseHeroPhoto(): Promise<string | null> {
  try {
    const docSnap = await getDoc(doc(db, STORE_SETTINGS_COLLECTION, 'hero_photo'));
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.value) {
        return data.value;
      }
    }
  } catch (err) {
    console.warn('Firebase getHero error:', err);
  }
  return null;
}

// Save all photos to Firebase Firestore
export async function savePhotosToFirebase(photos: PhotoMemory[], heroPhoto?: string): Promise<boolean> {
  try {
    // 1. Fetch current docs to remove any deleted photos
    const currentSnap = await getDocs(collection(db, STORE_PHOTOS_COLLECTION));
    const currentIds = new Set(currentSnap.docs.map((d) => d.id));
    const newIds = new Set(photos.map((p) => p.id));

    // Delete removed docs
    for (const docSnap of currentSnap.docs) {
      if (!newIds.has(docSnap.id)) {
        await deleteDoc(doc(db, STORE_PHOTOS_COLLECTION, docSnap.id));
      }
    }

    // Save each photo with orderIndex
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      await setDoc(doc(db, STORE_PHOTOS_COLLECTION, photo.id), {
        ...photo,
        orderIndex: i,
        updatedAt: new Date().toISOString(),
      });
    }

    // Save hero photo if provided
    if (heroPhoto) {
      await setDoc(doc(db, STORE_SETTINGS_COLLECTION, 'hero_photo'), {
        value: heroPhoto,
        updatedAt: new Date().toISOString(),
      });
    }

    // Backup to local storage
    try {
      localStorage.setItem(LOCAL_STORAGE_PHOTOS_KEY, JSON.stringify(photos));
      if (heroPhoto) {
        localStorage.setItem(LOCAL_STORAGE_HERO_KEY, heroPhoto);
      }
    } catch {
      // Ignore local storage quota
    }

    return true;
  } catch (err) {
    console.error('Failed to save to Firebase:', err);
    return false;
  }
}

// Save single updated photo to Firebase
export async function updatePhotoInFirebase(photo: PhotoMemory): Promise<boolean> {
  try {
    await setDoc(
      doc(db, STORE_PHOTOS_COLLECTION, photo.id),
      {
        ...photo,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.error('Failed to update photo in Firebase:', err);
    return false;
  }
}

// Delete single photo from Firebase
export async function deletePhotoFromFirebase(photoId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, STORE_PHOTOS_COLLECTION, photoId));
    return true;
  } catch (err) {
    console.error('Failed to delete photo from Firebase:', err);
    return false;
  }
}

// Save hero photo to Firebase
export async function saveHeroPhotoToFirebase(heroUrl: string): Promise<boolean> {
  try {
    await setDoc(doc(db, STORE_SETTINGS_COLLECTION, 'hero_photo'), {
      value: heroUrl,
      updatedAt: new Date().toISOString(),
    });
    try {
      localStorage.setItem(LOCAL_STORAGE_HERO_KEY, heroUrl);
    } catch {
      // Ignore
    }
    return true;
  } catch (err) {
    console.error('Failed to save hero photo to Firebase:', err);
    return false;
  }
}

// Clear all photos and reset
export async function clearAllFirebaseData(): Promise<boolean> {
  try {
    const snap = await getDocs(collection(db, STORE_PHOTOS_COLLECTION));
    for (const docSnap of snap.docs) {
      await deleteDoc(doc(db, STORE_PHOTOS_COLLECTION, docSnap.id));
    }
    await deleteDoc(doc(db, STORE_SETTINGS_COLLECTION, 'hero_photo'));
    localStorage.removeItem(LOCAL_STORAGE_PHOTOS_KEY);
    localStorage.removeItem(LOCAL_STORAGE_HERO_KEY);
    return true;
  } catch (err) {
    console.error('Failed to clear Firebase data:', err);
    return false;
  }
}
