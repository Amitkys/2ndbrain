"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import * as Icons from "lucide-react"
import { useSmartTextareaStore } from "@/lib/store/createStore"
import { getContentIcon } from "@/lib/CreateUtils/utils"

export function ContentItemsList() {
  const { 
    contentItems, 
    removeContentItem, 
    setFullScreenImage 
  } = useSmartTextareaStore()

  if (contentItems.length === 0) return null

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium">Content Items:</h3>
          <span className="text-xs text-muted-foreground">{contentItems.length} items</span>
        </div>

        <div className="space-y-3">
          {contentItems.map((item) => {
            const { icon: IconName, color } = getContentIcon(item.type)
            const Icon = Icons[IconName as keyof typeof Icons] as React.ComponentType<{ className?: string }>

            return (
              <div key={item.id} className="relative p-3 bg-muted rounded-md group">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`h-4 w-4 ${color}`} />
                  <span className="text-xs font-medium capitalize">{item.type}</span>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeContentItem(item.id)}
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
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}