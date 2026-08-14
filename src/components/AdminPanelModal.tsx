import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  Check,
  Star,
  RefreshCw,
  FolderDown,
  FolderUp,
  Plus,
  AlertCircle,
  FileImage,
  Layers,
  Heart,
  Sliders,
  CheckCircle,
  Sparkles,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { motion } from 'motion/react';
import { usePhotoContext, AddPhotoPayload } from '../context/PhotoContext';
import { formatBytes } from '../utils/photoStorage';
import { PhotoMemory } from '../data/harshitha';
import { soundEngine } from '../utils/sound';

interface PendingUploadItem {
  id: string;
  file: File;
  previewUrl: string;
  title: string;
  caption: string;
  category: 'all' | 'adventures' | 'smiles' | 'special' | 'candid';
  date: string;
  location: string;
  setAsHero: boolean;
}

export const AdminPanelModal: React.FC = () => {
  const {
    photos,
    heroPhoto,
    isAdminOpen,
    setIsAdminOpen,
    addPhotos,
    replacePhotoSlot,
    updatePhoto,
    deletePhoto,
    setHeroPhotoFromUrl,
    setHeroPhotoFromFile,
    resetHeroPhoto,
    reorderPhotos,
    resetAllPhotosToDefault,
    exportBackupJSON,
    importBackupJSON,
    templatePlaceholderCount,
    customPhotoCount,
  } = usePhotoContext();

  const [activeTab, setActiveTab] = useState<'upload' | 'manage' | 'hero' | 'settings'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<PendingUploadItem[]>([]);
  const [replaceTemplates, setReplaceTemplates] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<PhotoMemory>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const backupFileInputRef = useRef<HTMLInputElement>(null);
  const slotReplaceInputRef = useRef<HTMLInputElement>(null);
  const slotToReplaceRef = useRef<string | null>(null);

  if (!isAdminOpen) return null;

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4500);
  };

  // Process dropped/selected files
  const processFiles = (files: FileList | File[]) => {
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) {
      showToast('Please select valid image files (JPG, PNG, WebP, HEIC, etc.)', 'error');
      return;
    }

    const newPendingItems: PendingUploadItem[] = validFiles.map((file, idx) => {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      return {
        id: `pending-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        title: nameWithoutExt.charAt(0).toUpperCase() + nameWithoutExt.slice(1),
        caption: 'A precious moment with Harshitha.',
        category: 'smiles',
        date: 'Special Memory',
        location: 'With Harshitha',
        setAsHero: idx === 0 && customPhotoCount === 0, // Auto-suggest hero if first photo
      };
    });

    setPendingFiles((prev) => [...prev, ...newPendingItems]);
    soundEngine.playSparkleSound();
    showToast(`Added ${newPendingItems.length} photo(s) to staging! Click "Save Photos" below.`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const removePendingItem = (id: string) => {
    setPendingFiles((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  };

  const updatePendingItem = (id: string, updates: Partial<PendingUploadItem>) => {
    setPendingFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // Submit all pending files
  const handleSaveAllUploads = async () => {
    if (pendingFiles.length === 0) return;
    setIsSaving(true);

    try {
      const payloads: AddPhotoPayload[] = pendingFiles.map((p) => ({
        file: p.file,
        title: p.title,
        caption: p.caption,
        category: p.category,
        date: p.date,
        location: p.location,
        setAsHero: p.setAsHero,
      }));

      const success = await addPhotos(payloads, replaceTemplates);
      if (success) {
        pendingFiles.forEach((p) => URL.revokeObjectURL(p.previewUrl));
        setPendingFiles([]);
        showToast(
          replaceTemplates && templatePlaceholderCount > 0
            ? `Successfully replaced template slots with your ${payloads.length} photo(s)!`
            : `Successfully added ${payloads.length} photo(s) to Harshitha's gallery!`
        );
        setActiveTab('manage');
      } else {
        showToast('Failed to save photos. Please try again.', 'error');
      }
    } catch {
      showToast('An error occurred during photo processing.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Slot direct replace
  const handleTriggerSlotReplace = (photoId: string) => {
    slotToReplaceRef.current = photoId;
    slotReplaceInputRef.current?.click();
  };

  const handleSlotReplaceFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && slotToReplaceRef.current) {
      const file = e.target.files[0];
      const slotId = slotToReplaceRef.current;
      setIsSaving(true);
      try {
        const ok = await replacePhotoSlot(slotId, file);
        if (ok) {
          showToast('Photo updated and saved successfully!');
        }
      } finally {
        setIsSaving(false);
        slotToReplaceRef.current = null;
        e.target.value = '';
      }
    }
  };

  // Hero direct upload
  const handleHeroInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        await setHeroPhotoFromFile(file);
        showToast("Hero photo updated successfully!");
      }
      e.target.value = '';
    }
  };

  // Move photo up/down
  const handleMovePhoto = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= photos.length) return;

    const newPhotos = [...photos];
    const temp = newPhotos[index];
    newPhotos[index] = newPhotos[targetIndex];
    newPhotos[targetIndex] = temp;

    await reorderPhotos(newPhotos);
  };

  // Backup Export/Import
  const handleExportBackup = () => {
    const jsonStr = exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `harshitha_photos_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup file downloaded successfully!');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const content = evt.target?.result as string;
      const ok = await importBackupJSON(content);
      if (ok) {
        showToast('Backup restored successfully!');
      } else {
        showToast('Invalid backup file format.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xl">
      {/* Hidden file input for slot replacement */}
      <input
        ref={slotReplaceInputRef}
        type="file"
        accept="image/*"
        onChange={handleSlotReplaceFileChange}
        className="hidden"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl bg-[#150d1d] border border-rose-500/30 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-rose-500/20 flex items-center justify-between bg-[#1f122b]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.4)]">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-pink-200 to-amber-200">
                Photo Admin Studio
              </h2>
              <p className="text-xs text-rose-300/70 font-light">
                Fill templates & save real photos of Harshitha • Large files supported
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 text-rose-300 hover:text-white transition cursor-pointer"
            title="Close Admin Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-rose-500/15 px-6 bg-black/20 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'upload'
                ? 'border-rose-400 text-rose-200 bg-rose-500/10'
                : 'border-transparent text-rose-300/60 hover:text-rose-200 hover:bg-white/5'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Photos {pendingFiles.length > 0 && `(${pendingFiles.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'manage'
                ? 'border-rose-400 text-rose-200 bg-rose-500/10'
                : 'border-transparent text-rose-300/60 hover:text-rose-200 hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Gallery Slots ({photos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('hero')}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'hero'
                ? 'border-rose-400 text-rose-200 bg-rose-500/10'
                : 'border-transparent text-rose-300/60 hover:text-rose-200 hover:bg-white/5'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Hero Portrait</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'border-rose-400 text-rose-200 bg-rose-500/10'
                : 'border-transparent text-rose-300/60 hover:text-rose-200 hover:bg-white/5'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Backup & Settings</span>
          </button>
        </div>

        {/* Toast Alert */}
        {statusMessage && (
          <div
            className={`mx-6 mt-4 p-3 rounded-2xl flex items-center gap-2 text-xs font-medium ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-200'
                : 'bg-rose-500/20 border border-rose-500/30 text-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              {/* Dropzone Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4 ${
                  isDragging
                    ? 'border-rose-400 bg-rose-500/20 scale-[1.01] shadow-[0_0_30px_rgba(244,63,94,0.3)]'
                    : 'border-rose-500/30 bg-white/[0.02] hover:border-rose-400/60 hover:bg-rose-500/5'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500/30 to-amber-500/30 border border-rose-400/40 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-rose-300 animate-bounce" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-semibold text-rose-100">
                    Drag & Drop Photos of Harshitha Here
                  </h3>
                  <p className="text-xs sm:text-sm text-rose-200/60 max-w-md mx-auto font-light">
                    Select photos from your device to save them into the template frames.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] text-amber-300/80">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                      ⚡ Saves persistently in browser storage
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">
                      ✨ Auto-fills template cards
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md hover:scale-105 transition cursor-pointer"
                >
                  Browse Device Files
                </button>
              </div>

              {/* Upload Mode Preference */}
              <div className="p-4 rounded-2xl bg-black/30 border border-rose-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={replaceTemplates}
                    onChange={(e) => setReplaceTemplates(e.target.checked)}
                    className="w-4 h-4 rounded border-rose-500/40 text-rose-500 focus:ring-rose-400"
                  />
                  <div>
                    <span className="text-xs sm:text-sm font-semibold text-rose-100 block">
                      Replace placeholder templates with these uploaded photos
                    </span>
                    <span className="text-[11px] text-rose-300/60 block font-light">
                      Fills the existing template slots instead of adding extra blank cards.
                    </span>
                  </div>
                </label>

                {templatePlaceholderCount > 0 && (
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 text-[11px] font-semibold shrink-0">
                    {templatePlaceholderCount} Template slots open
                  </span>
                )}
              </div>

              {/* Pending Uploads Staging Area */}
              {pendingFiles.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-rose-100 text-base sm:text-lg flex items-center gap-2">
                      <FileImage className="w-5 h-5 text-rose-400" />
                      <span>Ready to Save ({pendingFiles.length} Photos)</span>
                    </h3>

                    <button
                      type="button"
                      onClick={() => {
                        pendingFiles.forEach((p) => URL.revokeObjectURL(p.previewUrl));
                        setPendingFiles([]);
                      }}
                      className="text-xs text-rose-300/60 hover:text-rose-200 underline cursor-pointer"
                    >
                      Clear Staging
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pendingFiles.map((item) => (
                      <div
                        key={item.id}
                        className="glass-panel p-4 rounded-2xl border border-rose-500/20 flex gap-4 items-start relative group"
                      >
                        {/* Thumbnail */}
                        <div className="w-24 h-28 rounded-xl overflow-hidden bg-black/50 shrink-0 border border-white/10 relative">
                          <img
                            src={item.previewUrl}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] text-rose-200">
                            {formatBytes(item.file.size)}
                          </div>
                        </div>

                        {/* Fields */}
                        <div className="flex-1 space-y-2 text-xs">
                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-rose-300/70 mb-0.5">
                              Title / Memory Name
                            </label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => updatePendingItem(item.id, { title: e.target.value })}
                              placeholder="Photo title..."
                              className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-rose-100 focus:border-rose-400 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-rose-300/70 mb-0.5">
                              Caption
                            </label>
                            <input
                              type="text"
                              value={item.caption}
                              onChange={(e) => updatePendingItem(item.id, { caption: e.target.value })}
                              placeholder="Photo caption or memory..."
                              className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-rose-100 focus:border-rose-400 focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] uppercase font-semibold text-rose-300/70 mb-0.5">
                                Category
                              </label>
                              <select
                                value={item.category}
                                onChange={(e) =>
                                  updatePendingItem(item.id, {
                                    category: e.target.value as PendingUploadItem['category'],
                                  })
                                }
                                className="w-full px-2 py-1.5 rounded-lg bg-[#1a0f24] border border-white/10 text-rose-100 focus:border-rose-400 focus:outline-none"
                              >
                                <option value="smiles">Radiant Smiles</option>
                                <option value="adventures">Adventures</option>
                                <option value="candid">Candid Laughs</option>
                                <option value="special">Special Occasions</option>
                              </select>
                            </div>

                            <div className="flex items-center pt-4">
                              <label className="flex items-center gap-1.5 cursor-pointer text-rose-200 select-none">
                                <input
                                  type="checkbox"
                                  checked={item.setAsHero}
                                  onChange={(e) =>
                                    updatePendingItem(item.id, { setAsHero: e.target.checked })
                                  }
                                  className="rounded border-rose-500/40 text-rose-500 focus:ring-rose-400"
                                />
                                <span className="text-[11px] font-medium">Hero Pic ⭐</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removePendingItem(item.id)}
                          className="p-1 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-500/20 transition shrink-0"
                          title="Remove photo from staging"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Save Button */}
                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={handleSaveAllUploads}
                      className="px-8 py-3.5 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 shadow-[0_0_25px_rgba(244,63,94,0.5)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSaving ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      <span>Save & Apply All {pendingFiles.length} Photos to Website</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MANAGE GALLERY */}
          {activeTab === 'manage' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif font-bold text-rose-100 text-lg">
                    Active Gallery Slots ({photos.length})
                  </h3>
                  <p className="text-xs text-rose-300/60 font-light">
                    Click "Replace Image" on any slot to upload your photo directly.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-rose-500/20 border border-rose-400/40 text-rose-200 hover:bg-rose-500/30 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload More Photos</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {photos.map((photo, index) => {
                  const isTemplate = photo.id.startsWith('photo-') && photo.url.startsWith('/images/');
                  const isEditing = editingPhotoId === photo.id;

                  return (
                    <div
                      key={photo.id}
                      className="glass-panel rounded-2xl p-4 border border-rose-500/20 flex flex-col justify-between gap-3 relative group"
                    >
                      {/* Photo Thumbnail & Hero Badge */}
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/40 border border-white/10">
                        <img
                          src={photo.url}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                        {heroPhoto === photo.url && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-500 text-stone-900 font-bold text-[10px] flex items-center gap-1 shadow-md">
                            <Star className="w-3 h-3 fill-stone-900" />
                            <span>Current Hero</span>
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full backdrop-blur-md text-[10px] font-medium">
                          {isTemplate ? (
                            <span className="bg-amber-500/80 text-stone-900 px-1.5 py-0.5 rounded font-bold">
                              Template Placeholder
                            </span>
                          ) : (
                            <span className="bg-emerald-500/80 text-white px-1.5 py-0.5 rounded font-bold">
                              Saved Photo
                            </span>
                          )}
                        </div>

                        {/* Replace Image Button directly on card */}
                        <button
                          type="button"
                          onClick={() => handleTriggerSlotReplace(photo.id)}
                          className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-black/75 hover:bg-rose-500 text-white text-[10px] font-semibold border border-white/20 shadow-md flex items-center gap-1 cursor-pointer transition"
                          title="Upload new image for this slot"
                        >
                          <Upload className="w-3 h-3 text-amber-300" />
                          <span>{isTemplate ? 'Add Pic' : 'Replace'}</span>
                        </button>
                      </div>

                      {/* Photo Details (View or Edit Mode) */}
                      {isEditing ? (
                        <div className="space-y-2 text-xs">
                          <input
                            type="text"
                            value={editFormData.title ?? photo.title}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, title: e.target.value })
                            }
                            placeholder="Title"
                            className="w-full px-2 py-1 rounded bg-black/50 border border-rose-400 text-rose-100"
                          />
                          <input
                            type="text"
                            value={editFormData.caption ?? photo.caption}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, caption: e.target.value })
                            }
                            placeholder="Caption"
                            className="w-full px-2 py-1 rounded bg-black/50 border border-rose-400 text-rose-100"
                          />
                          <div className="flex gap-2 justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => setEditingPhotoId(null)}
                              className="px-2 py-1 rounded bg-white/10 text-rose-300 text-[11px]"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                await updatePhoto(photo.id, editFormData);
                                setEditingPhotoId(null);
                                setEditFormData({});
                                showToast('Photo details updated!');
                              }}
                              className="px-2.5 py-1 rounded bg-rose-500 text-white text-[11px] font-semibold"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <h4 className="font-serif font-bold text-rose-100 text-sm truncate">
                              {photo.title}
                            </h4>
                            <span className="text-[10px] uppercase font-semibold text-rose-400/80 bg-rose-500/10 px-2 py-0.5 rounded-full">
                              {photo.category}
                            </span>
                          </div>
                          <p className="text-rose-200/60 line-clamp-2 font-light text-[11px]">
                            {photo.caption}
                          </p>
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="pt-2 border-t border-rose-500/15 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMovePhoto(index, 'up')}
                            className="p-1 rounded bg-white/5 hover:bg-white/15 text-rose-300 disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={index === photos.length - 1}
                            onClick={() => handleMovePhoto(index, 'down')}
                            className="p-1 rounded bg-white/5 hover:bg-white/15 text-rose-300 disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setHeroPhotoFromUrl(photo.url);
                              showToast('Set as hero profile portrait!');
                            }}
                            className="px-2 py-1 rounded bg-amber-500/15 hover:bg-amber-500/30 text-amber-200 text-[11px] font-medium transition cursor-pointer"
                            title="Use as main hero portrait photo"
                          >
                            Set Hero
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingPhotoId(photo.id);
                              setEditFormData({ title: photo.title, caption: photo.caption });
                            }}
                            className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-rose-200 text-[11px] transition cursor-pointer"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={async () => {
                              if (confirm(`Delete "${photo.title}"?`)) {
                                await deletePhoto(photo.id);
                                showToast('Photo removed.');
                              }
                            }}
                            className="p-1 rounded text-rose-400 hover:text-rose-200 hover:bg-rose-500/20 transition cursor-pointer"
                            title="Delete photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: HERO PORTRAIT */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif font-bold text-rose-100 text-lg">
                  Hero Profile Portrait
                </h3>
                <p className="text-xs text-rose-300/60 font-light">
                  This photo is featured on the main spotlight card at the top of Harshitha's birthday website.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Current Hero Preview */}
                <div className="md:col-span-5 flex justify-center">
                  <div className="w-64 aspect-[4/5] rounded-3xl overflow-hidden bg-black/50 border-2 border-rose-400/50 shadow-[0_15px_35px_rgba(244,63,94,0.3)] relative">
                    <img
                      src={heroPhoto}
                      alt="Hero portrait"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 right-3 p-2 rounded-xl bg-black/70 backdrop-blur-md text-center text-xs font-semibold text-rose-100 border border-white/10">
                      Current Spotlight Photo
                    </div>
                  </div>
                </div>

                {/* Hero Controls */}
                <div className="md:col-span-7 space-y-4">
                  <div
                    onClick={() => heroFileInputRef.current?.click()}
                    className="p-6 rounded-2xl border-2 border-dashed border-rose-500/30 hover:border-rose-400 hover:bg-rose-500/10 text-center cursor-pointer transition space-y-2"
                  >
                    <input
                      ref={heroFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleHeroInputChange}
                      className="hidden"
                    />
                    <Star className="w-8 h-8 text-amber-300 mx-auto animate-pulse" />
                    <h4 className="text-sm font-semibold text-rose-100">
                      Upload New Hero Spotlight Photo
                    </h4>
                    <p className="text-xs text-rose-300/60">
                      Click to choose a high-resolution picture from your device
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={async () => {
                        await resetHeroPhoto();
                        showToast('Reset hero photo to default.');
                      }}
                      className="px-4 py-2 rounded-full text-xs font-medium text-rose-300 bg-white/5 border border-white/10 hover:bg-white/15 transition cursor-pointer"
                    >
                      Reset Hero Photo to Default
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BACKUP & SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif font-bold text-rose-100 text-lg">
                  Backup, Restore & Reset
                </h3>
                <p className="text-xs text-rose-300/60 font-light">
                  Save all uploaded pictures to a JSON file or restore on another device.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Export Card */}
                <div className="glass-panel p-5 rounded-2xl border border-rose-500/20 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <FolderDown className="w-5 h-5 text-amber-300" />
                    <h4 className="font-semibold text-sm text-rose-100">
                      Export Photo Backup
                    </h4>
                  </div>
                  <p className="text-xs text-rose-200/70 font-light leading-relaxed">
                    Download a full backup file containing all your uploaded photos, captions, and hero setup.
                  </p>
                  <button
                    type="button"
                    onClick={handleExportBackup}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-400/40 text-amber-200 text-xs font-semibold hover:bg-amber-500/30 transition cursor-pointer"
                  >
                    Download Backup JSON
                  </button>
                </div>

                {/* Import Card */}
                <div className="glass-panel p-5 rounded-2xl border border-rose-500/20 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <FolderUp className="w-5 h-5 text-rose-400" />
                    <h4 className="font-semibold text-sm text-rose-100">
                      Restore Backup
                    </h4>
                  </div>
                  <p className="text-xs text-rose-200/70 font-light leading-relaxed">
                    Upload a previously exported backup file to restore all photos instantly.
                  </p>
                  <input
                    ref={backupFileInputRef}
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => backupFileInputRef.current?.click()}
                    className="w-full py-2.5 rounded-xl bg-white/5 border border-white/15 text-rose-200 text-xs font-semibold hover:bg-white/10 transition cursor-pointer"
                  >
                    Select Backup File
                  </button>
                </div>
              </div>

              {/* Reset */}
              <div className="p-5 rounded-2xl border border-rose-500/20 bg-rose-950/20 space-y-3">
                <div className="flex items-center gap-2 text-rose-400">
                  <AlertCircle className="w-5 h-5" />
                  <h4 className="font-semibold text-sm text-rose-200">
                    Reset All Photos to Defaults
                  </h4>
                </div>
                <p className="text-xs text-rose-300/70 font-light">
                  This will clear all custom uploaded photos stored in your browser and restore the original template placeholders.
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete all custom photos and restore template defaults?')) {
                      await resetAllPhotosToDefault();
                      showToast('All photos reset to template defaults.');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600/30 border border-rose-500/50 hover:bg-rose-600/50 text-rose-200 text-xs font-semibold transition cursor-pointer"
                >
                  Reset Everything to Defaults
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-rose-500/15 bg-[#170c21] flex items-center justify-between">
          <span className="text-xs text-rose-300/60 font-light">
            Photos are saved persistently in browser storage.
          </span>
          <button
            type="button"
            onClick={() => setIsAdminOpen(false)}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 border border-rose-400/40 transition cursor-pointer"
          >
            Done / Close Panel
          </button>
        </div>
      </motion.div>
    </div>
  );
};
