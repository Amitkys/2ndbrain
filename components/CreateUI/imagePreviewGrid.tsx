"use client"

import { Button } from "@/components/ui/button"
import { ZoomIn, X } from "lucide-react"
import { useSmartTextareaStore } from "@/lib/store/createStore"
import { formatFileSize } from "@/lib/CreateUtils/utils"

export function ImagePreviewGrid() {
  const { 
    previewImages, 
    removePreviewImage, 
    setPreviewFullScreenImage 
  } = useSmartTextareaStore()

  console.log("preview image", previewImages);

  if (previewImages.length === 0) return null

  return (
    <div className="mt-3">
      <div className="text-sm font-medium mb-2">Image Previews:</div>
      <div className="flex flex-wrap gap-3">
        {previewImages.map((image) => (
          <div key={image.id} className="relative group">
            <div
              className="w-24 h-24 md:w-32 md:h-32 rounded-md overflow-hidden bg-muted border border-border cursor-pointer"
              onClick={() => setPreviewFullScreenImage(image)}
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
  )
}