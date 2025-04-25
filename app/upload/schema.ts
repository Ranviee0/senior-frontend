import * as z from "zod"

export const uploadSchema = z.object({
  // Basic Information
  land_name: z.string().min(1, "Land name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  area: z.number().positive("Area must be a positive number"),
  price: z.number().positive("Price must be a positive number"),

  // Location Details
  address: z.string().min(1, "Address is required"),
  lattitude: z.number().min(-90).max(90, "Latitude must be between -90 and 90"),
  longitude: z.number().min(-180).max(180, "Longitude must be between -180 and 180"),
  zoning: z.string().optional(),
  pop_density: z.number().nonnegative("Population density cannot be negative"),
  flood_risk: z.enum(["low", "medium", "high", "unknown"], {
    required_error: "Please select a flood risk level",
  }),

  // Development Plans
  nearby_dev_plan: z.array(z.string()).min(1, "At least one development plan is required"),

  // Images
  images: z.array(z.instanceof(File)).optional(),
})

export type UploadFormValues = z.infer<typeof uploadSchema>

// Step-specific validation schemas
export const basicInfoSchema = uploadSchema.pick({
  land_name: true,
  description: true,
  area: true,
  price: true,
  images: true,
})

export const locationSchema = uploadSchema.pick({
  address: true,
  lattitude: true,
  longitude: true,
  zoning: true,
  pop_density: true,
  flood_risk: true,
})

export const developmentSchema = uploadSchema.pick({
  nearby_dev_plan: true,
})
