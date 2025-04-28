"use client"

import type React from "react"
import { Check, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { UploadFormValues } from "./schema"

interface ConfirmationModalProps {
  showModal: boolean
  setShowModal: (show: boolean) => void
  formData: UploadFormValues | null
  onConfirm: () => void
  isSubmitting: boolean
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  showModal,
  setShowModal,
  formData,
  onConfirm,
  isSubmitting,
}) => {
  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Land Upload</DialogTitle>
          <DialogDescription>Please review the land details before confirming the upload.</DialogDescription>
        </DialogHeader>

        {formData && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-sm">Land Name</h3>
                <p className="text-sm">{formData.land_name}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm">Price</h3>
                <p className="text-sm">{formatCurrency(formData.price)}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm">Area</h3>
                <p className="text-sm">{formData.area} sq.m</p>
              </div>
              <div>
                <h3 className="font-medium text-sm">Flood Risk</h3>
                <p className="text-sm capitalize">{formData.flood_risk}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm">Address</h3>
              <p className="text-sm">{formData.address}</p>
            </div>

            <div>
              <h3 className="font-medium text-sm">Description</h3>
              <p className="text-sm line-clamp-2">{formData.description}</p>
            </div>

            {formData.images && formData.images.length > 0 && (
              <div>
                <h3 className="font-medium text-sm">Images</h3>
                <p className="text-sm">{formData.images.length} image(s) selected</p>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex sm:justify-between">
          <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm} disabled={isSubmitting}>
            <Check className="mr-2 h-4 w-4" />
            {isSubmitting ? "Uploading..." : "Confirm Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
