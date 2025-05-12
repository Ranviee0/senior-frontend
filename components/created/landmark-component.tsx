"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import type { LatLngExpression } from "leaflet"
import { PannableCircleMarker } from "./pannable"
import { cn } from "@/lib/utils"

// MapController component to access the map instance
const MapController = ({
  selectedPosition,
  selectedLandmarkId,
}: {
  selectedPosition: LatLngExpression | null
  selectedLandmarkId: number | null
}) => {
  const map = useMap()

  // Fly to selected position when it changes
  useEffect(() => {
    if (selectedPosition) {
      // Use type assertion to tell TypeScript that map has flyTo method
      ;(map as any).flyTo(selectedPosition, (map as any).getZoom(), { animate: true })
    }
  }, [selectedPosition, map])

  return null
}

export type Landmark = {
  id: number
  type: string
  name: string
  latitude: number
  longitude: number
  distance_km: number
}

export type Land = {
  id: number
  landName: string
  description: string
  area: number
  price: number
  address: string
  latitude: number
  longitude: number
  zoning: string
  popDensity: number
  floodRisk: string
  nearbyDevPlan: string
  uploadedAt: string
  images: string[]
}

interface LandmarkMapProps {
  landmarks: Landmark[]
  land: Land
  landMarkerColor?: string
  landmarkMarkerColor?: string
  highlightedMarkerColor?: string
}

const LandmarkMap = ({
  landmarks,
  land,
  landMarkerColor = "#CC0000",
  landmarkMarkerColor = "#3388ff",
  highlightedMarkerColor = "#32CD32",
}: LandmarkMapProps) => {
  const [isClient, setIsClient] = useState(false)
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null)
  const [selectedPosition, setSelectedPosition] = useState<LatLngExpression | null>(null)

  const landPosition: LatLngExpression = {
    lat: land.latitude,
    lng: land.longitude,
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Function to handle landmark selection
  const handleLandmarkSelect = (landmark: Landmark) => {
    setSelectedLandmark(landmark)

    // Set the selected position to fly to
    const position: LatLngExpression = {
      lat: landmark.latitude,
      lng: landmark.longitude,
    }
    setSelectedPosition(position)
  }

  return (
    <div className="flex flex-col md:flex-row h-[600px] w-full border rounded-lg overflow-hidden">
      {/* Sidebar with landmarks list */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-gray-50 overflow-y-auto border-r">
        <div className="p-4 bg-white border-b">
          <h3 className="font-medium text-lg">Nearby Landmarks</h3>
          <p className="text-sm text-gray-500">{landmarks.length} locations found</p>
        </div>
        <ul className="divide-y">
          {landmarks.map((landmark) => (
            <li
              key={landmark.id}
              onClick={() => handleLandmarkSelect(landmark)}
              className={cn(
                "p-4 cursor-pointer hover:bg-gray-100 transition-colors",
                selectedLandmark?.id === landmark.id ? "bg-blue-50 border-l-4 border-blue-500" : "",
              )}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor:
                        selectedLandmark?.id === landmark.id ? highlightedMarkerColor : landmarkMarkerColor,
                    }}
                  />
                </div>
                <div className="ml-3">
                  <p className="font-medium">{landmark.name}</p>
                  <p className="text-sm text-gray-500">{landmark.type}</p>
                  <p className="text-sm text-gray-500">{landmark.distance_km.toFixed(2)} km away</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Map container */}
      <div className="flex-1 h-full">
        {isClient && (
          <MapContainer
            center={landPosition}
            zoom={14}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            {/* Map controller to handle flying to selected positions */}
            <MapController selectedPosition={selectedPosition} selectedLandmarkId={selectedLandmark?.id || null} />

            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Land Marker */}
            <PannableCircleMarker
              position={landPosition}
              popupContent={
                <div>
                  <strong>{land.landName}</strong>
                  <br />
                  {land.description}
                </div>
              }
              fillColor={landMarkerColor}
              radius={10}
            />

            {/* Landmarks Markers */}
            {landmarks.map((landmark) => {
              const isSelected = selectedLandmark?.id === landmark.id
              return (
                <PannableCircleMarker
                  key={landmark.id}
                  position={{ lat: landmark.latitude, lng: landmark.longitude }}
                  popupContent={
                    <div>
                      <strong>{landmark.name}</strong>
                      <br />
                      {landmark.type} — {landmark.distance_km.toFixed(2)} km from land
                    </div>
                  }
                  fillColor={isSelected ? highlightedMarkerColor : landmarkMarkerColor}
                  radius={isSelected ? 10 : 8}
                  isSelected={isSelected}
                  onClick={() => handleLandmarkSelect(landmark)}
                  openPopupOnSelect={isSelected}
                />
              )
            })}
          </MapContainer>
        )}
      </div>
    </div>
  )
}

export default LandmarkMap
