"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useFormContext, Controller } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThreeTier } from "@/components/created/three-tier"
import { LocationPicker } from "@/components/created/location-picker"
import provinceData from "@/data/provinces.json"
import type { ProvinceData } from "@/app/types"
import type { UploadFormValues } from "./schema"

export const LocationDetailsStep: React.FC = () => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<UploadFormValues>()

  const [province, setProvince] = useState<string>("")
  const [district, setDistrict] = useState<string>("")
  const [subdistrict, setSubdistrict] = useState<string>("")
  const [zipCode, setZipCode] = useState<string>("")
  const [streetAddress, setStreetAddress] = useState<string>("")
  const [data, setData] = useState<ProvinceData | null>(null)
  const [densityLevel, setDensityLevel] = useState<string>("")
  const [densityValue, setDensityValue] = useState<number>(0)

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

  return (
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
              <Input id="zipCode" value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="h-9" />
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
              {errors.flood_risk && <p className="text-xs text-red-500 mt-1">{errors.flood_risk.message as string}</p>}
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
  )
}
