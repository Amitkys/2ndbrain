import { ContentItem } from "@/lib/types/type"

export const generateId = () => `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export const parseContent = (text: string, generateId: () => string) => {
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

export const getContentIcon = (type: string) => {
  switch (type) {
    case "link":
      return { icon: "LinkIcon", color: "text-blue-500" }
    case "image":
      return { icon: "ImageIcon", color: "text-green-500" }
    default:
      return { icon: "FileText", color: "text-gray-500" }
  }
}