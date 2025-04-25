"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, CircleMarker, useMapEvents, useMap } from "react-leaflet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { type Control, Controller, type FieldValues, type Path } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import "leaflet/dist/leaflet.css"

// Bangkok coordinates
const BANGKOK_LAT = 13.7563
const BANGKOK_LNG = 100.5018

// Component to handle map clicks and update marker position
function MapClickHandler({
  setPosition,
}: {
  setPosition: (lat: number, lng: number) => void
}) {
  useMapEvents({
    click: (e) => {
      setPosition(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

// Component to update map center when coordinates change
function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()

  useEffect(() => {
    map.setView([lat, lng], map.getZoom())
  }, [lat, lng, map])

  return null
}

export interface LocationPickerProps<T extends FieldValues> {
  control: Control<T>
  latFieldId: Path<T>
  lngFieldId: Path<T>
  label?: string
  className?: string
  defaultLat?: number
  defaultLng?: number
  required?: boolean
}

export function LocationPicker<T extends FieldValues>({
  control,
  latFieldId,
  lngFieldId,
  label = "Location",
  className,
  defaultLat = BANGKOK_LAT,
  defaultLng = BANGKOK_LNG,
  required = false,
}: LocationPickerProps<T>) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-100 rounded-md">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <Label className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={control}
            name={latFieldId}
            rules={{ required }}
            render={({ field: latField, fieldState: latFieldState }) => (
              <Controller
                control={control}
                name={lngFieldId}
                rules={{ required }}
                render={({ field: lngField, fieldState: lngFieldState }) => {
                  const lat = latField.value !== undefined ? Number(latField.value) : defaultLat
                  const lng = lngField.value !== undefined ? Number(lngField.value) : defaultLng

                  const handlePositionChange = (newLat: number, newLng: number) => {
                    latField.onChange(newLat)
                    lngField.onChange(newLng)
                  }

                  return (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor={latFieldId.toString()}>Latitude</Label>
                        <Input
                          id={latFieldId.toString()}
                          value={lat}
                          onChange={(e) => {
                            const newLat = Number.parseFloat(e.target.value)
                            if (!isNaN(newLat) && newLat >= -90 && newLat <= 90) {
                              latField.onChange(newLat)
                            }
                          }}
                          type="number"
                          step="any"
                          min="-90"
                          max="90"
                          className={latFieldState.error ? "border-red-500" : ""}
                        />
                        {latFieldState.error && (
                          <p className="text-xs text-red-500">
                            {latFieldState.error.message || "Latitude is required"}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={lngFieldId.toString()}>Longitude</Label>
                        <Input
                          id={lngFieldId.toString()}
                          value={lng}
                          onChange={(e) => {
                            const newLng = Number.parseFloat(e.target.value)
                            if (!isNaN(newLng) && newLng >= -180 && newLng <= 180) {
                              lngField.onChange(newLng)
                            }
                          }}
                          type="number"
                          step="any"
                          min="-180"
                          max="180"
                          className={lngFieldState.error ? "border-red-500" : ""}
                        />
                        {lngFieldState.error && (
                          <p className="text-xs text-red-500">
                            {lngFieldState.error.message || "Longitude is required"}
                          </p>
                        )}
                      </div>

                      <div className="h-[300px] w-full rounded-md overflow-hidden border col-span-2">
                        <MapContainer center={[lat, lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <CircleMarker
                            center={[lat, lng]}
                            pathOptions={{
                              radius: 8,
                              color: "red",
                              fillColor: "red",
                              fillOpacity: 1,
                            }}
                          />
                          <MapClickHandler setPosition={handlePositionChange} />
                          <MapUpdater lat={lat} lng={lng} />
                        </MapContainer>
                      </div>
                    </>
                  )
                }}
              />
            )}
          />
        </div>
      </Card>
    </div>
  )
}
