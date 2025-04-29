"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ImageGalleryProps {
  images: string[]
  landName: string
}

export function ImageGallery({ images, landName }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // If no images are provided, use a placeholder
  const displayImages =
    images.length > 0 ? images : [`/placeholder.svg?height=600&width=800&query=real estate land property ${landName}`]

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0
    const newIndex = isFirstImage ? displayImages.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastImage = currentIndex === displayImages.length - 1
    const newIndex = isLastImage ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  return (
    <div className="relative rounded-xl overflow-hidden bg-gray-100">
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={displayImages[currentIndex] || "/placeholder.svg"}
          alt={`${landName} - Image ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority
        />
      </div>

      {displayImages.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full h-9 w-9"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full h-9 w-9"
            onClick={goToNext}
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {displayImages.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  currentIndex === index ? "bg-white scale-125" : "bg-white/50",
                )}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      <div className="mt-4 overflow-auto pb-2">
        <div className="flex gap-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "relative h-16 w-24 flex-shrink-0 rounded-md overflow-hidden border-2",
                currentIndex === index ? "border-primary" : "border-transparent",
              )}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${landName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
