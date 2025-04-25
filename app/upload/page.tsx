"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { ThreeTier } from "@/components/created/three-tier";
import provinceData from "@/data/provinces.json";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ImageUploadPreview } from "@/components/created/image-upload";
import type { Upload } from "@/app/types";
import type { ProvinceData } from "@/app/types";
import { LocationPicker } from "@/components/created/location-picker";

const UploadPage: React.FC = () => {
  const [province, setProvince] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [subdistrict, setSubdistrict] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [data, setData] = useState<ProvinceData | null>(null);
  const [densityLevel, setDensityLevel] = useState<string>("");
  const [densityValue, setDensityValue] = useState<number>(0);
  const [submittedData, setSubmittedData] = useState<Upload | null>(null);
  // Add a new state for street address
  const [streetAddress, setStreetAddress] = useState<string>("");

  const methods = useForm<Upload>({
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
      flood_risk: "low",
      nearby_dev_plan: [""],
    },
  });

  const { control, setValue, handleSubmit, watch, register } = methods;

  useEffect(() => {
    if (!province) return;

    const found = provinceData.find((p) => p["name-en"] === province);
    setData(found ?? null);

    if (found) {
      const density = Number(found.population) / Number(found.area_km2);
      setDensityValue(density);

      let level = "";
      if (density < 100) level = "low";
      else if (density <= 650) level = "medium";
      else level = "high";

      setDensityLevel(level);
      setValue("pop_density", density);
    }
  }, [province, setValue]);

  // Modify the useEffect for address concatenation to include street address
  useEffect(() => {
    const addressComponents = [];
    if (streetAddress) addressComponents.push(streetAddress);
    if (subdistrict) addressComponents.push(subdistrict);
    if (district) addressComponents.push(district);
    if (province) addressComponents.push(province);
    if (zipCode) addressComponents.push(zipCode);

    const fullAddress = addressComponents.join(", ");
    setValue("address", fullAddress);
  }, [province, district, subdistrict, zipCode, streetAddress, setValue]);

  const handleProvincesChange = (provinces: string[]) => {
    if (provinces.length > 0) {
      setProvince(provinces[0]);
    }
  };

  const handleDistrictsChange = (districts: string[]) => {
    if (districts.length > 0) {
      setDistrict(districts[0]);
    }
  };

  const handleSubdistrictsChange = (subdistricts: string[]) => {
    if (subdistricts.length > 0) {
      setSubdistrict(subdistricts[0]);
    }
  };

  const onSubmit = handleSubmit((data) => {
    console.log("Form submitted:", data);
    setSubmittedData(data);
  });

  return (
    <FormProvider {...methods}>
      <div className="w-full h-full overflow-auto">
        <div className="container mx-auto py-4 px-4 max-w-4xl pb-20">
          <h1 className="text-xl font-bold mb-4">Upload New Land</h1>
          <Separator className="my-3" />

          <div>
            <form onSubmit={onSubmit} className="space-y-4">
              <h2 className="text-md font-semibold">Basic Information</h2>

              {/* Property Images */}
              <div className="space-y-1">
                <ImageUploadPreview
                  onChange={(files) => {
                    // This will be connected to backend later
                    console.log("Files selected:", files);
                  }}
                />
              </div>
              <div className="text-xs text-gray-500">
                You can select multiple images at once. Will be connected to
                backend later.
              </div>

              <div className="space-y-1">
                <Label htmlFor="land_name" className="text-sm">
                  Land Name
                </Label>
                <Input
                  id="land_name"
                  {...register("land_name")}
                  className="h-9"
                />
              </div>
              <LocationPicker
                control={control}
                latFieldId="lattitude"
                lngFieldId="longitude"
                label="Select Location"
                required
              />

              {/* Basic Information */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="price" className="text-sm">
                    Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    {...register("price", { valueAsNumber: true })}
                    className="h-9"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="area" className="text-sm">
                    Area (sq.m)
                  </Label>
                  <Input
                    id="area"
                    type="number"
                    {...register("area", { valueAsNumber: true })}
                    className="h-9"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="zoning" className="text-sm">
                    Zoning
                  </Label>
                  <Input id="zoning" {...register("zoning")} className="h-9" />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="description" className="text-sm">
                  Description
                </Label>
                <Textarea
                  id="description"
                  rows={3}
                  {...register("description")}
                />
              </div>

              <Separator className="my-3" />

              {/* Location Details */}
              <h2 className="text-md font-semibold">Location Details</h2>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm mb-1 block">Address</Label>
                  <ThreeTier
                    control={control}
                    fieldId="address_components"
                    index={0}
                    onProvincesChange={handleProvincesChange}
                    onDistrictsChange={handleDistrictsChange}
                    onSubdistrictsChange={handleSubdistrictsChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="streetAddress" className="text-sm">
                      Street Address
                    </Label>
                    <Input
                      id="streetAddress"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="e.g. 51 Main St."
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-1">
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

                  <div className="space-y-1">
                    <Label className="text-sm">Population Density</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={densityValue.toFixed(2)}
                        readOnly
                        className="h-9 bg-gray-50"
                      />
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        ({densityLevel})
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="flood_risk" className="text-sm">
                      Flood Risk
                    </Label>
                    <Controller
                      control={control}
                      name="flood_risk"
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select risk level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm">Full Address</Label>
                  <Input
                    value={watch("address")}
                    readOnly
                    className="h-9 bg-gray-50"
                  />
                </div>
              </div>

              <Separator className="my-3" />

              {/* Development Plans */}
              <h2 className="text-md font-semibold">
                Nearby Development Plans
              </h2>

              <div className="space-y-3">
                <Controller
                  control={control}
                  name="nearby_dev_plan"
                  render={({ field }) => (
                    <div className="space-y-2">
                      {field.value.map((plan, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={plan}
                            onChange={(e) => {
                              const newPlans = [...field.value];
                              newPlans[index] = e.target.value;
                              field.onChange(newPlans);
                            }}
                            placeholder="Enter development plan"
                            className="h-9"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newPlans = field.value.filter(
                                (_, i) => i !== index
                              );
                              field.onChange(newPlans.length ? newPlans : [""]);
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
                          field.onChange([...field.value, ""]);
                        }}
                      >
                        Add Development Plan
                      </Button>
                    </div>
                  )}
                />
              </div>

              <Separator className="my-3" />

              <div className="pt-2">
                <Button type="submit" className="w-full">
                  Submit Land Details
                </Button>
              </div>
            </form>
          </div>

          {submittedData && (
            <div className="bg-white border rounded-md p-4">
              <h2 className="text-lg font-semibold mb-3">Submitted Data</h2>
              <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(submittedData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </FormProvider>
  );
};

export default UploadPage;
