"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ImageGalleryProps {
  images: string[]
  landName: string
}

export function ImageGallery({ images, landName }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalIndex, setModalIndex] = useState(0)

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

  const openModal = (index: number) => {
    setModalIndex(index)
    setModalOpen(true)
  }

  const goToPreviousModal = () => {
    const isFirstImage = modalIndex === 0
    const newIndex = isFirstImage ? displayImages.length - 1 : modalIndex - 1
    setModalIndex(newIndex)
  }

  const goToNextModal = () => {
    const isLastImage = modalIndex === displayImages.length - 1
    const newIndex = isLastImage ? 0 : modalIndex + 1
    setModalIndex(newIndex)
  }

  // Handle keyboard navigation in modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      goToPreviousModal()
    } else if (e.key === "ArrowRight") {
      goToNextModal()
    } else if (e.key === "Escape") {
      setModalOpen(false)
    }
  }

  return (
    <>
      <div className="relative rounded-xl overflow-hidden bg-gray-100">
        <div className="relative aspect-[4/3] w-full cursor-pointer" onClick={() => openModal(currentIndex)}>
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
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full h-9 w-9"
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
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
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentIndex(index)
                  }}
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

      {/* Custom modal implementation with fixed positioning */}
      {modalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[9996]"
          style={{ position: "fixed", zIndex: 9996 }}
        >
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/80 z-[9996]" onClick={() => setModalOpen(false)} />

          {/* Modal content */}
          <div className="relative z-[9997] flex items-center justify-center w-full h-full" onKeyDown={handleKeyDown}>
            {/* Image container */}
            <div className="relative max-h-[85vh] max-w-[85vw] z-[9998]">
              <Image
                src={displayImages[modalIndex] || "/placeholder.svg"}
                alt={`${landName} - Image ${modalIndex + 1} (Full view)`}
                width={1200}
                height={900}
                className="object-contain max-h-[85vh]"
                priority
                style={{ zIndex: 9998 }}
              />

              {/* Screen reader only title */}
              <span className="sr-only">
                {landName} - Image {modalIndex + 1} of {displayImages.length}
              </span>
            </div>

            {/* Controls */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full z-[9999]"
              onClick={() => setModalOpen(false)}
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </Button>

            {displayImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full h-10 w-10 z-[9999]"
                  onClick={goToPreviousModal}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full h-10 w-10 z-[9999]"
                  onClick={goToNextModal}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-[9999]">
                  {displayImages.map((_, index) => (
                    <button
                      key={index}
                      className={cn(
                        "w-3 h-3 rounded-full transition-all",
                        modalIndex === index ? "bg-white scale-125" : "bg-white/50",
                      )}
                      onClick={() => setModalIndex(index)}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
