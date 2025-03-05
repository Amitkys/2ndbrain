"use client"

import { useState, useRef, useEffect, type ChangeEvent, type ClipboardEvent, useCallback } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, LinkIcon, ImageIcon, FileText, X, ZoomIn } from "lucide-react"

// Define content item type
type ContentItem = {
  id: string
  type: "text" | "link" | "image"
  value: string
}

type PreviewImage = {
  id: string
  data: string
  name: string
  size: number
}

export default function SmartTextarea() {
  const [inputText, setInputText] = useState("")
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([])
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null)
  const [previewFullScreenImage, setPreviewFullScreenImage] = useState<PreviewImage | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Generate unique ID
  const generateId = useCallback(() => `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, [])

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Function to detect and parse content
  const parseContent = (text: string) => {
    const urlPattern =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g
    const urls = text.match(urlPattern) || []
    let remainingText = text

    urls.forEach((url, index) => {
      remainingText = remainingText.replace(url, `__URL_${index}__`)
    })

    const parts = remainingText.split(/__URL_\d+__/)
    const newItems: ContentItem[] = []

    let urlIndex = 0
    parts.forEach((part) => {
      if (part.trim()) {
        newItems.push({
          id: generateId(),
          type: "text",
          value: part.trim(),
        })
      }

      if (urlIndex < urls.length) {
        newItems.push({
          id: generateId(),
          type: "link",
          value: urls[urlIndex],
        })
        urlIndex++
      }
    })

    return newItems
  }

  // Handle text submission
  const handleSubmit = () => {
    const newItems: ContentItem[] = []

    // Add text/links if present
    if (inputText.trim()) {
      newItems.push(...parseContent(inputText))
    }

    // Add images if present
    previewImages.forEach((image) => {
      newItems.push({
        id: generateId(),
        type: "image",
        value: image.data, // In production, this would be the Cloudinary URL
      })
    })

    if (newItems.length > 0) {
      setContentItems((prev) => [...prev, ...newItems])
      console.log("Added content items:", newItems)
      setInputText("")
      setPreviewImages([]) // Clear preview images after adding
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
        const reader = new FileReader()
        reader.onload = (event) => {
          if (typeof event.target?.result === "string") {
            setPreviewImages((prev) => [
              ...prev,
              {
                id: generateId(),
                data: event.target.result,
                name: file.name,
                size: file.size,
              },
            ])
          }
        }
        reader.readAsDataURL(file)
      }
    })

    // Reset file input
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

        const reader = new FileReader()
        reader.onload = (event) => {
          if (typeof event.target?.result === "string") {
            setPreviewImages((prev) => [
              ...prev,
              {
                id: generateId(),
                data: event.target.result,
                name: `Pasted Image ${new Date().toLocaleTimeString()}`,
                size: blob.size,
              },
            ])
          }
        }
        reader.readAsDataURL(blob)
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
            const reader = new FileReader()
            reader.onload = (event) => {
              if (typeof event.target?.result === "string") {
                setPreviewImages((prev) => [
                  ...prev,
                  {
                    id: generateId(),
                    data: event.target.result,
                    name: file.name,
                    size: file.size,
                  },
                ])
              }
            }
            reader.readAsDataURL(file)
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
  }, [generateId])

  // Preview an image in full screen
  const previewImage = (image: PreviewImage) => {
    setPreviewFullScreenImage(image)
  }

  // Remove a preview image
  const removePreviewImage = (id: string) => {
    setPreviewImages((prev) => prev.filter((image) => image.id !== id))
  }

  // Remove a content item
  const removeItem = (id: string) => {
    setContentItems((prev) => prev.filter((item) => item.id !== id))
  }

  // Clear all
  const handleClear = () => {
    setContentItems([])
    setInputText("")
    setPreviewImages([])
    console.log("All content cleared")
  }

  // Get icon for content type
  const getContentIcon = (type: string) => {
    switch (type) {
      case "link":
        return <LinkIcon className="h-4 w-4 text-blue-500" />
      case "image":
        return <ImageIcon className="h-4 w-4 text-green-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

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

        {/* Image Previews */}
        {previewImages.length > 0 && (
          <div className="mt-3">
            <div className="text-sm font-medium mb-2">Image Previews:</div>
            <div className="flex flex-wrap gap-3">
              {previewImages.map((image) => (
                <div key={image.id} className="relative group">
                  <div
                    className="w-24 h-24 md:w-32 md:h-32 rounded-md overflow-hidden bg-muted border border-border cursor-pointer"
                    onClick={() => previewImage(image)}
                  >
                    <img
                      src={image.data || "/placeholder.svg"}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all">
                      <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 truncate">
                    {formatFileSize(image.size)}
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-6 w-6 absolute -top-2 -right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removePreviewImage(image.id)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            Add Images
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
            onClick={handleClear}
            disabled={contentItems.length === 0 && previewImages.length === 0}
            className="flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>

      {contentItems.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">Content Items:</h3>
              <span className="text-xs text-muted-foreground">{contentItems.length} items</span>
            </div>

            <div className="space-y-3">
              {contentItems.map((item) => (
                <div key={item.id} className="relative p-3 bg-muted rounded-md group">
                  <div className="flex items-center gap-2 mb-1">
                    {getContentIcon(item.type)}
                    <span className="text-xs font-medium capitalize">{item.type}</span>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>

                  {item.type === "text" && <div className="text-sm break-words">{item.value}</div>}

                  {item.type === "link" && (
                    <a
                      href={item.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-blue-600 hover:underline break-words"
                    >
                      {item.value}
                    </a>
                  )}

                  {item.type === "image" && (
                    <div className="flex justify-center mt-2">
                      <img
                        src={item.value || "/placeholder.svg"}
                        alt="Content image"
                        className="max-h-[200px] rounded-md object-contain cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setFullScreenImage(item.value)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-sm text-muted-foreground">
        <p>Instructions:</p>
        <ul className="list-disc list-inside ml-2">
          <li>Type text and URLs together, then click "Add Content"</li>
          <li>URLs will be automatically detected and made clickable</li>
          <li>Paste an image from clipboard (Ctrl+V)</li>
          <li>Drag and drop an image file</li>
          <li>Click on image previews to see them in full size</li>
          <li>Hover over items to see the remove button</li>
        </ul>
        <p className="mt-2">All content is logged to the console (F12 to view)</p>
      </div>

      {/* Full screen image modal for content items */}
      {fullScreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-full max-h-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full z-10"
              onClick={() => setFullScreenImage(null)}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Button>
            <img
              src={fullScreenImage || "/placeholder.svg"}
              alt="Full screen image"
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
          </div>
        </div>
      )}

      {/* Full screen preview for image previews */}
      {previewFullScreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-full max-h-full">
            <div className="absolute top-2 right-2 flex gap-2 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full"
                onClick={() => setPreviewFullScreenImage(null)}
              >
                <X className="h-6 w-6" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="text-white absolute top-2 left-2 text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
              {previewFullScreenImage.name} ({formatFileSize(previewFullScreenImage.size)})
            </div>
            <img
              src={previewFullScreenImage.data || "/placeholder.svg"}
              alt={previewFullScreenImage.name}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}

