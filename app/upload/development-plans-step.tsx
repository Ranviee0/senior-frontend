"use client"

import type React from "react"
import { useFormContext, Controller } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { UploadFormValues } from "./schema"

export const DevelopmentPlansStep: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<UploadFormValues>()

  return (
    <div className="space-y-6">
      <h2 className="text-md font-semibold mb-4">Nearby Development Plans</h2>

      <div className="space-y-4">
        <Controller
          control={control}
          name="nearby_dev_plan"
          render={({ field }) => (
            <div className="space-y-3">
              {field.value.map((plan, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={plan}
                    onChange={(e) => {
                      const newPlans = [...field.value]
                      newPlans[index] = e.target.value
                      field.onChange(newPlans)
                    }}
                    placeholder="Enter development plan"
                    className={`h-9 ${errors.nearby_dev_plan ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newPlans = field.value.filter((_, i) => i !== index)
                      field.onChange(newPlans.length ? newPlans : [""])
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  field.onChange([...field.value, ""])
                }}
              >
                Add Development Plan
              </Button>
              {errors.nearby_dev_plan && (
                <p className="text-xs text-red-500 mt-1">{errors.nearby_dev_plan.message as string}</p>
              )}
            </div>
          )}
        />
      </div>
    </div>
  )
}
