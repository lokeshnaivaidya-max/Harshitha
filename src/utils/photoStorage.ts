import { PhotoMemory } from '../data/harshitha';

const DB_NAME = 'HarshithaBirthdayDB';
const DB_VERSION = 1;
const STORE_PHOTOS = 'gallery_photos';
const STORE_SETTINGS = 'app_settings';
const LOCAL_STORAGE_PHOTOS_KEY = 'harshitha_saved_photos';
const LOCAL_STORAGE_HERO_KEY = 'harshitha_saved_hero';

// Helper to open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_PHOTOS)) {
        db.createObjectStore(STORE_PHOTOS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
        db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Convert a large File (>5MB) to high-quality Data URL with smart compression
export function fileToDataUrl(file: File, maxDimension = 1920, quality = 0.9): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawResult = e.target?.result as string;
      if (!rawResult) {
        reject(new Error('Failed to read file'));
        return;
      }

      if (file.type === 'image/svg+xml' || file.size < 250 * 1024) {
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

// Get all photos from IndexedDB with LocalStorage fallback
export async function getStoredPhotos(): Promise<PhotoMemory[] | null> {
  try {
    const db = await openDB();
    const photos = await new Promise<PhotoMemory[] | null>((resolve) => {
      const tx = db.transaction(STORE_PHOTOS, 'readonly');
      const store = tx.objectStore(STORE_PHOTOS);
      const req = store.getAll();
      req.onsuccess = () => {
        const result = req.result as PhotoMemory[];
        if (result && result.length > 0) {
          resolve(result);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });

    if (photos && photos.length > 0) {
      return photos;
    }
  } catch (err) {
    console.warn('IndexedDB read error, checking LocalStorage:', err);
  }

  // Fallback to localStorage
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_PHOTOS_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore
  }

  return null;
}

// Save all photos to IndexedDB and LocalStorage
export async function saveStoredPhotos(photos: PhotoMemory[]): Promise<boolean> {
  try {
    const db = await openDB();
    await new Promise<boolean>((resolve) => {
      const tx = db.transaction(STORE_PHOTOS, 'readwrite');
      const store = tx.objectStore(STORE_PHOTOS);
      
      store.clear();
      photos.forEach((photo) => {
        store.put(photo);
      });

      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (err) {
    console.error('Error saving photos to IndexedDB:', err);
  }

  try {
    localStorage.setItem(LOCAL_STORAGE_PHOTOS_KEY, JSON.stringify(photos));
  } catch {
    // Ignore quota issues
  }

  return true;
}

// Get custom hero photo
export async function getStoredHeroPhoto(): Promise<string | null> {
  try {
    const db = await openDB();
    const hero = await new Promise<string | null>((resolve) => {
      const tx = db.transaction(STORE_SETTINGS, 'readonly');
      const store = tx.objectStore(STORE_SETTINGS);
      const req = store.get('hero_photo');
      req.onsuccess = () => {
        if (req.result && req.result.value) {
          resolve(req.result.value);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });

    if (hero) return hero;
  } catch {
    // Fallback
  }

  try {
    return localStorage.getItem(LOCAL_STORAGE_HERO_KEY);
  } catch {
    return null;
  }
}

// Save custom hero photo
export async function saveStoredHeroPhoto(photoUrl: string): Promise<boolean> {
  try {
    const db = await openDB();
    await new Promise<boolean>((resolve) => {
      const tx = db.transaction(STORE_SETTINGS, 'readwrite');
      const store = tx.objectStore(STORE_SETTINGS);
      store.put({ key: 'hero_photo', value: photoUrl });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch {
    // Fallback
  }

  try {
    localStorage.setItem(LOCAL_STORAGE_HERO_KEY, photoUrl);
  } catch {
    // Ignore
  }

  return true;
}

// Clear all custom data and reset
export async function clearAllStoredData(): Promise<boolean> {
  try {
    const db = await openDB();
    await new Promise<boolean>((resolve) => {
      const tx = db.transaction([STORE_PHOTOS, STORE_SETTINGS], 'readwrite');
      tx.objectStore(STORE_PHOTOS).clear();
      tx.objectStore(STORE_SETTINGS).clear();
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch {
    // Ignore
  }

  try {
    localStorage.removeItem(LOCAL_STORAGE_PHOTOS_KEY);
    localStorage.removeItem(LOCAL_STORAGE_HERO_KEY);
  } catch {
    // Ignore
  }

  return true;
}
