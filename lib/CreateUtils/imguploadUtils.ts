import { ContentItem } from "@/lib/types/type"
import axios from "axios"
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await axios.post("/api/img", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    if (response.data.secure_url) {
      return response.data.secure_url // Return Cloudinary URL
    } else {
      throw new Error("Upload failed")
    }
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error)
    throw error
  }
}

export const dataURLtoFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(",")
  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

export const handleImageUpload = async (
  previewImages: { id: string; data: string; name: string; size: number }[], 
  uploadFunction: (file: File) => Promise<string>
): Promise<ContentItem[]> => {
  const uploadedImages: ContentItem[] = []
  for (const image of previewImages) {
    try {
      const cloudinaryUrl = await uploadFunction(
        dataURLtoFile(image.data, image.name)
      )
      uploadedImages.push({
        id: image.id,
        type: "image", // Explicitly set the type to "image"
        value: cloudinaryUrl,
      })
    } catch (error) {
      console.error("Failed to upload image:", image.name, error)
    }
  }
  return uploadedImages
}

export const createImagePreview = (
  file: File, 
  addPreviewImages: (images: { id: string; data: string; name: string; size: number }[]) => void,
  generateId: () => string
) => {
  const reader = new FileReader()
  reader.onload = (event) => {
    if (typeof event.target?.result === "string") {
      addPreviewImages([
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
