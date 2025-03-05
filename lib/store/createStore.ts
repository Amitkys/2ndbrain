import { create } from 'zustand'
import { SmartTextareaState } from '@/lib/types/type'


export const useSmartTextareaStore = create<SmartTextareaState>((set) => ({
  inputText: '',
  contentItems: [],
  previewImages: [],
  fullScreenImage: null,
  previewFullScreenImage: null,

  setInputText: (text) => set({ inputText: text }),

  addContentItems: (newItems) => set((state) => ({
    contentItems: [...state.contentItems, ...newItems],
    inputText: '',
    previewImages: []
  })),

  addPreviewImages: (newImages) => set((state) => ({
    previewImages: [...state.previewImages, ...newImages]
  })),

  removePreviewImage: (id) => set((state) => ({
    previewImages: state.previewImages.filter((image) => image.id !== id)
  })),

  removeContentItem: (id) => set((state) => ({
    contentItems: state.contentItems.filter((item) => item.id !== id)
  })),

  clearAll: () => set({
    contentItems: [],
    inputText: '',
    previewImages: []
  }),

  setFullScreenImage: (image) => set({ fullScreenImage: image }),

  setPreviewFullScreenImage: (image) => set({ previewFullScreenImage: image })
}))