"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

// Define the landmark data type
interface Landmark {
  id: number
  name: string
  type: string
  latitude: number
  longitude: number
}

export default function MapComponent() {
  const [mounted, setMounted] = useState(false)
  const [landmarkData, setLandmarkData] = useState<Landmark[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)

    // Fetch landmark data from the backend
    const fetchLandmarks = async () => {
      try {
        setIsLoading(true)
        // Replace with your actual API endpoint
        const response = await fetch("http://0.0.0.0:8000/list-landmarks/")

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
        setLandmarkData(data)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch landmarks:", err)
        setError("Failed to load landmarks. Please try again later.")

        // For development/demo purposes, use sample data if API fails
        setLandmarkData([
          {
            name: "BTS เคหะฯ",
            longitude: 100.6076939,
            type: "Train Station",
            id: 1,
            latitude: 13.5676866,
          },
          {
            name: "BTS แยกคปอ.",
            longitude: 100.6258647,
            type: "Train Station",
            id: 2,
            latitude: 13.92502,
          },
          {
            name: "BTS ห้าแยกลาดพร้าว",
            longitude: 100.5620832,
            type: "Train Station",
            id: 3,
            latitude: 13.8166739,
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchLandmarks()
  }, [])

  if (!mounted) return null

  // Show loading state
  if (isLoading && landmarkData.length === 0) {
    return <div className="h-full w-full flex items-center justify-center">Loading map data...</div>
  }

  // Show error state if there's an error and no fallback data
  if (error && landmarkData.length === 0) {
    return <div className="h-full w-full flex items-center justify-center text-red-500">{error}</div>
  }

  // If no landmarks are available after loading
  if (!isLoading && landmarkData.length === 0) {
    return <div className="h-full w-full flex items-center justify-center">No landmarks available</div>
  }

  // Calculate the center of the map based on the average of all coordinates
  const center = landmarkData.reduce(
    (acc, landmark) => {
      return {
        lat: acc.lat + landmark.latitude / landmarkData.length,
        lng: acc.lng + landmark.longitude / landmarkData.length,
      }
    },
    { lat: 0, lng: 0 },
  )

  return (
    <div className="h-full w-full relative">
      {error && (
        <div className="absolute top-2 left-2 right-2 z-[1000] bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 text-sm">
          {error} Using sample data instead.
        </div>
      )}

      <MapContainer
        className="h-full w-full"
        // Fix for TypeScript error - pass center and zoom as part of MapOptions
        {...{
          center: [center.lat, center.lng],
          zoom: 10,
          scrollWheelZoom: true,
        }}
      >
        {/* Fix for TileLayer TypeScript error */}
        <TileLayer
          {...{
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          }}
        />

        {landmarkData.map((landmark) => (
          // Fix for CircleMarker TypeScript error
          <CircleMarker
            key={landmark.id}
            {...{
              center: [landmark.latitude, landmark.longitude],
              radius: 8,
              pathOptions: {
                fillColor: "#3b82f6",
                fillOpacity: 0.8,
                color: "#1d4ed8",
                weight: 1,
              },
            }}
          >
            <Popup>
              <div>
                <h3 className="font-bold">{landmark.name}</h3>
                <p>Type: {landmark.type}</p>
                <p>
                  Coordinates: {landmark.latitude.toFixed(6)}, {landmark.longitude.toFixed(6)}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}

