export type PreviewImage = {
  id: string
  data: string
  name: string
  size: number
}


export type SmartTextareaState = {
  inputText: string
  contentItems: ContentItem[]
  previewImages: PreviewImage[]
  fullScreenImage: string | null
  previewFullScreenImage: PreviewImage | null
  setInputText: (text: string) => void
  addContentItems: (items: ContentItem[]) => void
  addPreviewImages: (images: PreviewImage[]) => void
  removePreviewImage: (id: string) => void
  removeContentItem: (id: string) => void
  clearAll: () => void
  setFullScreenImage: (image: string | null) => void
  setPreviewFullScreenImage: (image: PreviewImage | null) => void
}

export type ContentItem = {
  id: string
  type: "text" | "link" | "image"
  value: string
}
