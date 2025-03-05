"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useSmartTextareaStore } from "@/lib/store/createStore"
import { formatFileSize } from "@/lib/CreateUtils/utils"

export function ImageFullScreenModal() {
  const { 
    fullScreenImage, 
    setFullScreenImage, 
    previewFullScreenImage, 
    setPreviewFullScreenImage 
  } = useSmartTextareaStore()

  // Full screen modal for content items
  if (fullScreenImage) {
    return (
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
    )
  }

  // Full screen modal for image previews
  if (previewFullScreenImage) {
    return (
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
    )
  }

  return null
}