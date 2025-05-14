"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

// Update the ImageUploadPreviewProps interface to be more specific
interface ImageUploadPreviewProps {
  onChange?: (files: File[]) => void
  value?: File[]
}

// Update the component to accept and use the value prop
export function ImageUploadPreview({ onChange, value }: ImageUploadPreviewProps) {
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>(() => {
    // Initialize previews from value prop if provided
    return value
      ? value.map((file) => ({
          file,
          url: URL.createObjectURL(file),
        }))
      : []
  })
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    const newFiles = Array.from(e.target.files)
    const newPreviews = newFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))

    setPreviews((prev) => [...prev, ...newPreviews])

    if (onChange) {
      onChange([...previews.map((p) => p.file), ...newFiles])
    }

    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Remove an image
  const removeImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent opening the modal when removing

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index].url)

    const newPreviews = previews.filter((_, i) => i !== index)
    setPreviews(newPreviews)

    if (onChange) {
      onChange(newPreviews.map((p) => p.file))
    }

    // If the modal is open and we're removing the current image, close the modal
    if (selectedImageIndex === index) {
      setSelectedImageIndex(null)
    } else if (selectedImageIndex !== null && selectedImageIndex > index) {
      // Adjust the selected index if we're removing an image before it
      setSelectedImageIndex(selectedImageIndex - 1)
    }
  }

  // Modal controls
  const openModal = (index: number) => {
    setSelectedImageIndex(index)
  }

  const closeModal = () => {
    setSelectedImageIndex(null)
  }

  const navigateImage = (direction: "next" | "prev") => {
    if (selectedImageIndex === null || previews.length <= 1) return

    if (direction === "next") {
      setSelectedImageIndex((selectedImageIndex + 1) % previews.length)
    } else {
      setSelectedImageIndex((selectedImageIndex - 1 + previews.length) % previews.length)
    }
  }

  // Modal keyboard and click outside handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return

      switch (e.key) {
        case "Escape":
          closeModal()
          break
        case "ArrowRight":
          navigateImage("next")
          break
        case "ArrowLeft":
          navigateImage("prev")
          break
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeModal()
      }
    }

    if (selectedImageIndex !== null) {
      document.addEventListener("keydown", handleKeyDown)
      document.addEventListener("mousedown", handleClickOutside)
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = ""
    }
  }, [selectedImageIndex, previews.length])

  // Drag and drop handlers
  const [isDragging, setIsDragging] = useState(false)

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!isDragging) {
        setIsDragging(true)
      }
    },
    [isDragging],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (!e.dataTransfer.files?.length) return

      const newFiles = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
      if (newFiles.length === 0) return

      const newPreviews = newFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }))

      setPreviews((prev) => [...prev, ...newPreviews])

      if (onChange) {
        onChange([...previews.map((p) => p.file), ...newFiles])
      }
    },
    [onChange, previews],
  )

  return (
    <div className="space-y-4">
      {/* Drag and drop area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-gray-300"
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <div className="text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto h-12 w-12"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80"
            >
              <span>Upload images</span>
              <input
                id="file-upload"
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>

      {/* Image thumbnails */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="w-24 h-24 border rounded overflow-hidden cursor-pointer" onClick={() => openModal(index)}>
                <img
                  src={preview.url || "/placeholder.svg"}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={(e) => removeImage(index, e)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Image modal */}
      {selectedImageIndex !== null && previews.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div ref={modalRef} className="relative max-w-[90vw] max-h-[90vh] overflow-hidden rounded-lg">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Navigation buttons */}
            {previews.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage("prev")}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => navigateImage("next")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Full-size image */}
            <img
              src={previews[selectedImageIndex].url || "/placeholder.svg"}
              alt="Full size preview"
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />

            {/* Image counter */}
            {previews.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                {selectedImageIndex + 1} / {previews.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
