"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useForm, FormProvider, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ThreeTier } from "@/components/created/three-tier"
import provinceData from "@/data/provinces.json"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ImageUploadPreview } from "@/components/created/image-upload"
import type { ProvinceData } from "@/app/types"
import { LocationPicker } from "@/components/created/location-picker"
import { uploadSchema, type UploadFormValues } from "./schema"
import { AlertCircle, Check, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

const UploadPage: React.FC = () => {
  const router = useRouter()
  const [province, setProvince] = useState<string>("")
  const [district, setDistrict] = useState<string>("")
  const [subdistrict, setSubdistrict] = useState<string>("")
  const [zipCode, setZipCode] = useState<string>("")
  const [data, setData] = useState<ProvinceData | null>(null)
  const [densityLevel, setDensityLevel] = useState<string>("")
  const [densityValue, setDensityValue] = useState<number>(0)
  const [streetAddress, setStreetAddress] = useState<string>("")
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [stepErrors, setStepErrors] = useState<string[]>([])
  const [submissionStatus, setSubmissionStatus] = useState<{
    success: boolean
    message: string
  } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false)
  const [formDataToSubmit, setFormDataToSubmit] = useState<UploadFormValues | null>(null)

  const steps = [
    { title: "Basic Information", description: "Land details and images" },
    { title: "Location Details", description: "Address and geographical information" },
    { title: "Development Plans", description: "Nearby development information" },
  ]

  const methods = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      land_name: "",
      description: "",
      address: "",
      area: 0,
      price: 0,
      lattitude: 13.7563,
      longitude: 100.5018,
      zoning: "",
      pop_density: 0,
      flood_risk: "unknown",
      nearby_dev_plan: [""],
      images: [],
    },
    mode: "onChange",
  })

  const {
    control,
    setValue,
    handleSubmit,
    watch,
    register,
    formState: { errors, isValid },
    trigger,
    getValues,
  } = methods

  // Function to validate the current step
  const validateStep = async () => {
    let isStepValid = false
    const newErrors: string[] = []

    switch (currentStep) {
      case 0:
        isStepValid = await trigger(["land_name", "description", "area", "price"])
        if (!isStepValid) {
          if (errors.land_name) newErrors.push(errors.land_name.message as string)
          if (errors.description) newErrors.push(errors.description.message as string)
          if (errors.area) newErrors.push(errors.area.message as string)
          if (errors.price) newErrors.push(errors.price.message as string)
        }
        break
      case 1:
        isStepValid = await trigger(["address", "lattitude", "longitude", "zoning", "pop_density", "flood_risk"])
        if (!isStepValid) {
          if (errors.address) newErrors.push(errors.address.message as string)
          if (errors.lattitude) newErrors.push(errors.lattitude.message as string)
          if (errors.longitude) newErrors.push(errors.longitude.message as string)
          if (errors.zoning) newErrors.push(errors.zoning.message as string)
          if (errors.pop_density) newErrors.push(errors.pop_density.message as string)
          if (errors.flood_risk) newErrors.push(errors.flood_risk.message as string)
        }
        break
      case 2:
        isStepValid = await trigger(["nearby_dev_plan"])
        if (!isStepValid && errors.nearby_dev_plan) {
          newErrors.push(errors.nearby_dev_plan.message as string)
        }
        break
    }

    setStepErrors(newErrors)
    return isStepValid
  }

  // Function to handle next step
  const handleNextStep = async () => {
    const isStepValid = await validateStep()
    if (isStepValid) {
      setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
      setStepErrors([])
    }
  }

  useEffect(() => {
    if (!province) return

    const found = provinceData.find((p) => p["name-en"] === province)
    setData(found ?? null)

    if (found) {
      const density = Number(found.population) / Number(found.area_km2)
      setDensityValue(density)

      let level = ""
      if (density < 100) level = "low"
      else if (density <= 650) level = "medium"
      else level = "high"

      setDensityLevel(level)
      setValue("pop_density", density)
    }
  }, [province, setValue])

  useEffect(() => {
    const addressComponents = []
    if (streetAddress) addressComponents.push(streetAddress)
    if (subdistrict) addressComponents.push(subdistrict)
    if (district) addressComponents.push(district)
    if (province) addressComponents.push(province)
    if (zipCode) addressComponents.push(zipCode)

    const fullAddress = addressComponents.join(", ")
    setValue("address", fullAddress)
  }, [province, district, subdistrict, zipCode, streetAddress, setValue])

  // Effect to handle redirect after successful submission
  useEffect(() => {
    let redirectTimer: NodeJS.Timeout

    if (submissionStatus?.success) {
      // Redirect to home page after 1.5 seconds to allow user to see success message
      redirectTimer = setTimeout(() => {
        router.push("/")
      }, 1500)
    }

    return () => {
      if (redirectTimer) clearTimeout(redirectTimer)
    }
  }, [submissionStatus, router])

  const handleProvincesChange = (provinces: string[]) => {
    if (provinces.length > 0) {
      setProvince(provinces[0])
    }
  }

  const handleDistrictsChange = (districts: string[]) => {
    if (districts.length > 0) {
      setDistrict(districts[0])
    }
  }

  const handleSubdistrictsChange = (subdistricts: string[]) => {
    if (subdistricts.length > 0) {
      setSubdistrict(subdistricts[0])
    }
  }

  // Handle form submission
  const handleFormSubmit = (values: UploadFormValues) => {
    setFormDataToSubmit(values)
    setShowConfirmModal(true)
  }

  // Handle actual submission after confirmation
  const submitForm = async () => {
    if (!formDataToSubmit || isSubmitting) return

    try {
      setIsSubmitting(true)
      setSubmissionStatus(null)
      setShowConfirmModal(false)

      const formData = new FormData()

      formData.append("land_name", formDataToSubmit.land_name)
      formData.append("description", formDataToSubmit.description)
      formData.append("area", formDataToSubmit.area.toString())
      formData.append("price", formDataToSubmit.price.toString())
      formData.append("address", formDataToSubmit.address)
      formData.append("lattitude", formDataToSubmit.lattitude.toString())
      formData.append("longitude", formDataToSubmit.longitude.toString())
      formData.append("pop_density", formDataToSubmit.pop_density.toString())
      formData.append("flood_risk", formDataToSubmit.flood_risk)
      if (formDataToSubmit.zoning) formData.append("zoning", formDataToSubmit.zoning)

      formDataToSubmit.nearby_dev_plan.forEach((plan) => {
        formData.append("nearby_dev_plan", plan)
      })

      if (formDataToSubmit.images && formDataToSubmit.images.length > 0) {
        formDataToSubmit.images.forEach((file) => {
          formData.append("images", file)
        })
      }

      const response = await fetch("http://localhost:8000/admin/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`)
      const result = await response.json()
      console.log("✅ Upload success:", result)
      setSubmissionStatus({
        success: true,
        message: "Land details uploaded successfully! Redirecting to home page...",
      })
      // Redirect is now handled by the useEffect
    } catch (error) {
      console.error("❌ Upload error:", error)
      setSubmissionStatus({
        success: false,
        message: `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    } finally {
      setIsSubmitting(false)
      setFormDataToSubmit(null)
    }
  }

  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <FormProvider {...methods}>
      <div className="w-full h-full overflow-auto">
        <div className="container mx-auto py-8 px-4 max-w-4xl pb-20">
          <h1 className="text-xl font-bold mb-4">Upload New Land</h1>

          {/* Step indicator */}
          <div className="mb-8">
            <div className="grid grid-cols-3 gap-0">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center relative ${
                    index < steps.length - 1
                      ? "after:content-[''] after:absolute after:top-5 after:left-1/2 after:w-full after:h-0.5 after:bg-gray-200 after:z-0"
                      : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 z-10
                      ${
                        currentStep === index
                          ? "bg-primary text-primary-foreground"
                          : currentStep > index
                            ? "bg-primary/80 text-primary-foreground"
                            : "bg-gray-200 text-gray-500"
                      }`}
                    onClick={() => setCurrentStep(index)}
                    style={{ cursor: "pointer" }}
                  >
                    {index + 1}
                  </div>
                  <div className="text-sm font-medium text-center">{step.title}</div>
                  <div className="text-xs text-gray-500 text-center px-2">{step.description}</div>

                  {index < steps.length - 1 && (
                    <div className="absolute top-5 left-1/2 w-full h-0.5 z-0" style={{ transform: "translateX(0%)" }}>
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: currentStep > index ? "100%" : "0%" }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-3" />

          {/* Validation errors */}
          {stepErrors.length > 0 && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc pl-5">
                  {stepErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Submission status */}
          {submissionStatus && (
            <Alert variant={submissionStatus.success ? "default" : "destructive"} className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{submissionStatus.message}</AlertDescription>
            </Alert>
          )}

          <div>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
              {/* Step 1: Basic Information */}
              {currentStep === 0 && (
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
                    {errors.land_name && (
                      <p className="text-xs text-red-500 mt-1">{errors.land_name.message as string}</p>
                    )}
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-3 gap-4">
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
                    {errors.description && (
                      <p className="text-xs text-red-500 mt-1">{errors.description.message as string}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Location Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-md font-semibold mb-4">Location Details</h2>

                  <div className="space-y-4">
                    <div>
                      <div className="grid grid-cols-6 gap-4 mb-4">
                        <div className="space-y-2 col-span-4">
                          <Label htmlFor="streetAddress" className="text-sm">
                            Street Address <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="streetAddress"
                            value={streetAddress}
                            onChange={(e) => setStreetAddress(e.target.value)}
                            placeholder="e.g. 51 Main St."
                            className={`h-9 ${errors.address ? "border-red-500" : ""}`}
                          />
                        </div>

                        <div className="space-y-2 col-span-1">
                          <Label htmlFor="zipCode" className="text-sm">
                            Zip Code
                          </Label>
                          <Input
                            id="zipCode"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            className="h-9"
                          />
                        </div>

                        <div className="space-y-2 col-span-1">
                          <Label className="text-sm">Population Density</Label>
                          <div className="flex items-center space-x-2">
                            <Input value={densityValue.toFixed(2)} readOnly className="h-9 bg-gray-50" />
                            <span className="text-xs text-gray-500 whitespace-nowrap">({densityLevel})</span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <ThreeTier
                          control={control}
                          fieldId="address_components"
                          index={0}
                          onProvincesChange={handleProvincesChange}
                          onDistrictsChange={handleDistrictsChange}
                          onSubdistrictsChange={handleSubdistrictsChange}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1 space-y-2">
                          <Label htmlFor="flood_risk" className="text-sm">
                            Flood Risk <span className="text-red-500">*</span>
                          </Label>
                          <Controller
                            control={control}
                            name="flood_risk"
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className={`h-9 ${errors.flood_risk ? "border-red-500" : ""}`}>
                                  <SelectValue placeholder="Select risk level" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="unknown">Unknown</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.flood_risk && (
                            <p className="text-xs text-red-500 mt-1">{errors.flood_risk.message as string}</p>
                          )}
                        </div>
                        <div className="col-span-1 space-y-2">
                          <Label htmlFor="zoning" className="text-sm">
                            Zoning
                          </Label>
                          <Input id="zoning" {...register("zoning")} className="h-9" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <LocationPicker
                      control={control}
                      latFieldId="lattitude"
                      lngFieldId="longitude"
                      label="Select Location"
                      required
                    />
                    {(errors.lattitude || errors.longitude) && (
                      <p className="text-xs text-red-500 mt-1">Valid location coordinates are required</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Development Plans */}
              {currentStep === 2 && (
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
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCurrentStep(Math.max(0, currentStep - 1))
                    setStepErrors([])
                  }}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={handleNextStep}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Land Details"}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Land Upload</DialogTitle>
            <DialogDescription>Please review the land details before confirming the upload.</DialogDescription>
          </DialogHeader>

          {formDataToSubmit && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Land Name</h3>
                  <p className="text-sm">{formDataToSubmit.land_name}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Price</h3>
                  <p className="text-sm">{formatCurrency(formDataToSubmit.price)}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Area</h3>
                  <p className="text-sm">{formDataToSubmit.area} sq.m</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Flood Risk</h3>
                  <p className="text-sm capitalize">{formDataToSubmit.flood_risk}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-sm">Address</h3>
                <p className="text-sm">{formDataToSubmit.address}</p>
              </div>

              <div>
                <h3 className="font-medium text-sm">Description</h3>
                <p className="text-sm line-clamp-2">{formDataToSubmit.description}</p>
              </div>

              {formDataToSubmit.images && formDataToSubmit.images.length > 0 && (
                <div>
                  <h3 className="font-medium text-sm">Images</h3>
                  <p className="text-sm">{formDataToSubmit.images.length} image(s) selected</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setShowConfirmModal(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="button" onClick={submitForm} disabled={isSubmitting}>
              <Check className="mr-2 h-4 w-4" />
              {isSubmitting ? "Uploading..." : "Confirm Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormProvider>
  )
}

export default UploadPage
