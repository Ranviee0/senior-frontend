"use client"

import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { uploadSchema, type UploadFormValues } from "./schema"
import { useRouter } from "next/navigation"
import { StepIndicator } from "./step-indicator"
import { BasicInformationStep } from "./basic-information-step"
import { LocationDetailsStep } from "./location-details-step"
import { DevelopmentPlansStep } from "./development-plans-step"
import { PriceStep } from "./price-step"
import { ConfirmationModal } from "./confirmation-modal"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const UploadPage = () => {
  const router = useRouter()
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
    { title: "Price", description: "Land pricing information" },
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
    handleSubmit,
    trigger,
    formState: { errors },
  } = methods

  // Function to validate the current step
  const validateStep = async () => {
    let isStepValid = false
    const newErrors: string[] = []

    switch (currentStep) {
      case 0:
        isStepValid = await trigger(["land_name", "description", "area"])
        if (!isStepValid) {
          if (errors.land_name) newErrors.push(errors.land_name.message as string)
          if (errors.description) newErrors.push(errors.description.message as string)
          if (errors.area) newErrors.push(errors.area.message as string)
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
      case 3:
        isStepValid = await trigger(["price"])
        if (!isStepValid) {
          if (errors.price) newErrors.push(errors.price.message as string)
        }
        break
    }

    setStepErrors(newErrors)
    return isStepValid
  }

  // Function to check if all previous steps are valid
  const areAllPreviousStepsValid = async () => {
    // Check steps 0, 1, and 2
    const step0Valid = await trigger(["land_name", "description", "area"], { shouldFocus: false })
    if (!step0Valid) return false

    const step1Valid = await trigger(["address", "lattitude", "longitude", "zoning", "pop_density", "flood_risk"], {
      shouldFocus: false,
    })
    if (!step1Valid) return false

    const step2Valid = await trigger(["nearby_dev_plan"], { shouldFocus: false })
    if (!step2Valid) return false

    return true
  }

  // Function to handle next step
  const handleNextStep = async () => {
    const isStepValid = await validateStep()
    if (isStepValid) {
      // If moving to the price step (step 3), check if all previous steps are valid
      if (currentStep === 2) {
        const allValid = await areAllPreviousStepsValid()
        if (allValid) {
          setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
          setStepErrors([])
        } else {
          setStepErrors(["Please complete all previous steps before setting the price"])
        }
      } else {
        setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
        setStepErrors([])
      }
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

      // Redirect to home page after 1.5 seconds
      setTimeout(() => {
        router.push("/")
      }, 1500)
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

  // Handle step navigation
  const handleStepClick = async (index: number) => {
    // If trying to navigate to the price step (index 3), check if all previous steps are valid
    if (index === 3) {
      const allValid = await areAllPreviousStepsValid()
      if (allValid) {
        setCurrentStep(index)
      } else {
        setStepErrors(["Please complete all previous steps before setting the price"])
      }
    } else {
      setCurrentStep(index)
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="w-full h-full overflow-auto">
        <div className="container mx-auto py-8 px-4 max-w-4xl pb-20">
          <h1 className="text-xl font-bold mb-4">Upload New Land</h1>

          {/* Step indicator */}
          <StepIndicator steps={steps} currentStep={currentStep} onStepClick={handleStepClick} />

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
              {/* Step content */}
              {currentStep === 0 && <BasicInformationStep />}
              {currentStep === 1 && <LocationDetailsStep />}
              {currentStep === 2 && <DevelopmentPlansStep />}
              {currentStep === 3 && <PriceStep />}

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
      <ConfirmationModal
        showModal={showConfirmModal}
        setShowModal={setShowConfirmModal}
        formData={formDataToSubmit}
        onConfirm={submitForm}
        isSubmitting={isSubmitting}
      />
    </FormProvider>
  )
}

export default UploadPage
