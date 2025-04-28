import type React from "react"
import { useFormContext } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { UploadFormValues } from "./schema"

export const PriceStep: React.FC = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<UploadFormValues>()

  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-md font-semibold mb-4">Price Information</h2>

      <div className="space-y-2">
        <Label htmlFor="price" className="text-sm">
          Price <span className="text-red-500">*</span>
        </Label>
        <Input
          id="price"
          type="number"
          {...register("price", { valueAsNumber: true })}
          className={`h-9 ${errors.price ? "border-red-500" : ""}`}
        />
        {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message as string}</p>}
      </div>

      <div className="mt-4">
        <p className="text-sm text-muted-foreground">
          Enter the total price for this land. This will be displayed to potential buyers.
        </p>

        {watch("price") > 0 && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <h3 className="font-medium mb-2">Price Preview</h3>
            <p className="text-2xl font-bold">{formatCurrency(watch("price"))}</p>
            {watch("area") > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Price per sq.m: {formatCurrency(watch("price") / watch("area"))}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
