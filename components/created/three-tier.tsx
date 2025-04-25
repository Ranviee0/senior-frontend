"use client"

import { useState, useEffect } from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { type Control, useWatch } from "react-hook-form"

// Import the Thai address data
import thaiAddressData from "@/data/thai_nested.json"

type ThaiAddressData = {
  [province: string]: {
    [district: string]: string[]
  }
}

interface ThaiAddressSelectorProps {
  control: Control<any>
  fieldId: string
  index: number
  namePrefix?: string
  required?: boolean
  onProvincesChange?: (provinces: string[]) => void
  onDistrictsChange?: (districts: string[]) => void
  onSubdistrictsChange?: (subdistricts: string[]) => void
}

export function ThreeTier({
  control,
  fieldId,
  index,
  namePrefix = "",
  required = false,
  onProvincesChange,
  onDistrictsChange,
  onSubdistrictsChange,
}: ThaiAddressSelectorProps) {
  // Define field paths using array index instead of fieldId
  const provincePath = `${namePrefix}.${index}.province`
  const districtPath = `${namePrefix}.${index}.district`
  const subDistrictPath = `${namePrefix}.${index}.subdistrict`

  // Watch individual fields instead of the whole array
  const selectedProvince = useWatch({
    control,
    name: provincePath,
    defaultValue: "",
  })

  const selectedDistrict = useWatch({
    control,
    name: districtPath,
    defaultValue: "",
  })

  // Local state for available options
  const [provinces, setProvinces] = useState<string[]>([])
  const [districts, setDistricts] = useState<string[]>([])
  const [subDistricts, setSubDistricts] = useState<string[]>([])

  // Local state for dropdown open/close
  const [openProvince, setOpenProvince] = useState(false)
  const [openDistrict, setOpenDistrict] = useState(false)
  const [openSubDistrict, setOpenSubDistrict] = useState(false)

  // Initialize provinces on component mount
  useEffect(() => {
    const data = thaiAddressData as ThaiAddressData
    setProvinces(Object.keys(data))
  }, [])

  // Remove this useEffect
  // useEffect(() => {
  //   if (onProvincesChange) {
  //     onProvincesChange(provinces);
  //   }
  // }, [provinces, onProvincesChange]);

  // Add this useEffect instead
  useEffect(() => {
    if (onProvincesChange && selectedProvince) {
      // Just pass the selected province as a single-item array
      onProvincesChange([selectedProvince])
    }
  }, [selectedProvince, onProvincesChange])

  // Add this useEffect for districts
  useEffect(() => {
    if (onDistrictsChange && selectedDistrict) {
      // Pass the selected district as a single-item array
      onDistrictsChange([selectedDistrict])
    }
  }, [selectedDistrict, onDistrictsChange])

  // Add this useEffect for subdistricts
  useEffect(() => {
    if (onSubdistrictsChange && selectedProvince && selectedDistrict) {
      const data = thaiAddressData as ThaiAddressData
      const districts = data[selectedProvince] || {}
      const currentSubdistricts = districts[selectedDistrict] || []
      if (selectedProvince && selectedDistrict) {
        onSubdistrictsChange(currentSubdistricts)
      }
    }
  }, [selectedProvince, selectedDistrict, onSubdistrictsChange])

  // Update districts when province changes
  useEffect(() => {
    if (selectedProvince) {
      const data = thaiAddressData as ThaiAddressData
      setDistricts(Object.keys(data[selectedProvince] || {}))
    } else {
      setDistricts([])
    }
  }, [selectedProvince])

  // Update sub-districts when district changes
  useEffect(() => {
    const data = thaiAddressData as ThaiAddressData
    if (selectedProvince && selectedDistrict) {
      const districts = data[selectedProvince] || {}
      setSubDistricts(districts[selectedDistrict] || [])
    } else {
      setSubDistricts([])
    }
  }, [selectedProvince, selectedDistrict])

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {/* Province Combobox */}
      <div>
        <FormField
          control={control}
          name={provincePath}
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Province{required && <span className="ml-1 text-red-500">*</span>}</FormLabel>
              <Popover open={openProvince} onOpenChange={setOpenProvince}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openProvince}
                      className="w-full justify-between font-normal"
                    >
                      {field.value ? field.value : "Select Province..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                      <CommandEmpty>Not Found</CommandEmpty>
                      <CommandGroup className="max-h-60 overflow-y-auto">
                        {provinces.map((province) => (
                          <CommandItem
                            key={province}
                            value={province}
                            onSelect={() => {
                              field.onChange(province)
                              // Clear dependent fields
                              control._formValues[districtPath] = ""
                              control._formValues[subDistrictPath] = ""
                              setOpenProvince(false)
                            }}
                          >
                            <Check
                              className={cn("mr-2 h-4 w-4", field.value === province ? "opacity-100" : "opacity-0")}
                            />
                            {province}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* District Combobox */}
      <div>
        <FormField
          control={control}
          name={districtPath}
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>District{required && <span className="ml-1 text-red-500">*</span>}</FormLabel>
              <Popover open={openDistrict} onOpenChange={setOpenDistrict}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openDistrict}
                      className="w-full justify-between font-normal"
                      disabled={!selectedProvince}
                    >
                      {field.value ? field.value : "Select District..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                      <CommandEmpty>Not Found</CommandEmpty>
                      <CommandGroup className="max-h-60 overflow-y-auto">
                        {districts.map((district) => (
                          <CommandItem
                            key={district}
                            value={district}
                            onSelect={() => {
                              field.onChange(district)
                              // Clear dependent field
                              control._formValues[subDistrictPath] = ""
                              setOpenDistrict(false)
                            }}
                          >
                            <Check
                              className={cn("mr-2 h-4 w-4", field.value === district ? "opacity-100" : "opacity-0")}
                            />
                            {district}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Sub-district Combobox */}
      <div>
        <FormField
          control={control}
          name={subDistrictPath}
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Subdistrict{required && <span className="ml-1 text-red-500">*</span>}</FormLabel>
              <Popover open={openSubDistrict} onOpenChange={setOpenSubDistrict}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openSubDistrict}
                      className="w-full justify-between font-normal"
                      disabled={!selectedProvince || !selectedDistrict}
                    >
                      {field.value ? field.value : "Select Subdistrict"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                      <CommandEmpty>Not Found</CommandEmpty>
                      <CommandGroup className="max-h-60 overflow-y-auto">
                        {subDistricts.map((subDistrict) => (
                          <CommandItem
                            key={subDistrict}
                            value={subDistrict}
                            onSelect={() => {
                              field.onChange(subDistrict)
                              setOpenSubDistrict(false)
                            }}
                          >
                            <Check
                              className={cn("mr-2 h-4 w-4", field.value === subDistrict ? "opacity-100" : "opacity-0")}
                            />
                            {subDistrict}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
