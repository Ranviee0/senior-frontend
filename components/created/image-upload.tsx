"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X } from "lucide-react"

interface ImageUploadPreviewProps {
  onChange?: (files: File[]) => void
}

export function ImageUploadPreview({ onChange }: ImageUploadPreviewProps) {
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const removeImage = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index].url)

    const newPreviews = previews.filter((_, i) => i !== index)
    setPreviews(newPreviews)

    if (onChange) {
      onChange(newPreviews.map((p) => p.file))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {previews.map((preview, index) => (
          <div key={index} className="relative group">
            <div className="w-24 h-24 border rounded overflow-hidden">
              <img
                src={preview.url || "/placeholder.svg"}
                alt={`Preview ${index}`}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-24 h-24 border border-dashed rounded flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
        >
          + Add
        </button>
      </div>

      <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
    </div>
  )
}
