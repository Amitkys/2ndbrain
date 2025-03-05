"use client"

import { useRef, useEffect, type ChangeEvent, type ClipboardEvent } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Trash2, FileInput, SparklesIcon } from "lucide-react"

import { useSmartTextareaStore } from "@/lib/store/createStore"
import { ContentItem } from "@/lib/types/type"
import { generateId, parseContent } from "@/lib/CreateUtils/utils"
import { ImagePreviewGrid } from "@/components/CreateUI/imagePreviewGrid"
import { ContentItemsList } from "@/components/CreateUI/contentItems"
import { ImageFullScreenModal } from "@/components/CreateUI/imageFullScreen"
import Instruction from "@/components/CreateUI/Instruction"

// Import utility functions
import {
  uploadImageToCloudinary,
  handleImageUpload,
  createImagePreview
} from "@/lib/CreateUtils/imguploadUtils"

export default function SmartTextarea() {
  const {
    inputText,
    setInputText,
    addContentItems,
    previewImages,
    addPreviewImages,
    contentItems,
    clearAll,
  } = useSmartTextareaStore()

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle text submission
  const handleSubmit = async () => {
    const newItems: ContentItem[] = []

    // Add text/links if present
    if (inputText.trim()) {
      newItems.push(...parseContent(inputText, generateId))
    }

    // Upload images to Cloudinary and add them as content items
    const uploadedImages = await handleImageUpload(
      previewImages,
      uploadImageToCloudinary
    )
    newItems.push(...uploadedImages)

    if (newItems.length > 0) {
      addContentItems(newItems)
      console.log("Added content items:", newItems)
    }
  }

  // Handle text change
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)
  }

  // Handle file selection
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        createImagePreview(file, addPreviewImages, generateId)
      }
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Handle image paste
  const handlePaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        e.preventDefault()
        const blob = items[i].getAsFile()
        if (!blob) continue

        createImagePreview(
          blob,
          addPreviewImages,
          () => `Pasted Image ${new Date().toLocaleTimeString()}`
        )
        break
      }
    }
  }

  // Handle drag and drop
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      if (e.dataTransfer?.files) {
        Array.from(e.dataTransfer.files).forEach((file) => {
          if (file.type.indexOf("image") !== -1) {
            createImagePreview(file, addPreviewImages, generateId)
          }
        })
      }
    }

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
    }

    textarea.addEventListener("drop", handleDrop)
    textarea.addEventListener("dragover", handleDragOver)

    return () => {
      textarea.removeEventListener("drop", handleDrop)
      textarea.removeEventListener("dragover", handleDragOver)
    }
  }, [addPreviewImages])

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 p-4">
      <div className="space-y-2">
        <Textarea
          ref={textareaRef}
          placeholder="Type or paste text, links, or images here..."
          className="min-h-[120px] resize-y"
          value={inputText}
          onChange={handleChange}
          onPaste={handlePaste}
        />


        <div className="flex justify-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={previewImages.length > 0}
          >
            {previewImages.length > 0 ?
              <SparklesIcon className="mr-2 h-4 w-4" /> :
              <FileInput className="mr-2 h-4 w-4" />
            }
            {previewImages.length > 0 ? "Upgrade" : "Add Images"}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSubmit}
            disabled={!inputText.trim() && previewImages.length === 0}
          >
            Add Content
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAll}
            disabled={contentItems.length === 0 && previewImages.length === 0}
            className="flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" /> Clear All
          </Button>
        </div>
      </div>
      <ImagePreviewGrid />

      <ContentItemsList />

      <Instruction />

      <ImageFullScreenModal />
    </div>
  )
}