"use client"

import type React from "react"
import { useFormContext } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUploadPreview } from "@/components/created/image-upload"
import type { UploadFormValues } from "./schema"

export const BasicInformationStep: React.FC = () => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<UploadFormValues>()

  return (
    <div className="space-y-6">
      <h2 className="text-md font-semibold mb-4">Basic Information</h2>

      {/* Property Images */}
      <div className="space-y-3">
        <ImageUploadPreview onChange={(files) => setValue("images", files)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="land_name" className="text-sm">
          Land Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="land_name"
          {...register("land_name")}
          className={`h-9 ${errors.land_name ? "border-red-500" : ""}`}
        />
        {errors.land_name && <p className="text-xs text-red-500 mt-1">{errors.land_name.message as string}</p>}
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="area" className="text-sm">
            Area (sq.m) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="area"
            type="number"
            {...register("area", { valueAsNumber: true })}
            className={`h-9 ${errors.area ? "border-red-500" : ""}`}
          />
          {errors.area && <p className="text-xs text-red-500 mt-1">{errors.area.message as string}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          rows={3}
          {...register("description")}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message as string}</p>}
      </div>
    </div>
  )
}
