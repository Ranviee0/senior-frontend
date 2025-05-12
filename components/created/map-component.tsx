"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Define types for our landmarks
interface LandInfo {
  id: number
  name: string
  latitude: number
  longitude: number
}

interface Landmark {
  id: number
  type: "MRT" | "BTS" | "CBD" | "Office" | "Condo" | "Tourist"
  name: string
  latitude: number
  longitude: number
  distance_km: number
}

interface MapComponentProps {
  land: LandInfo
  landmarks: Landmark[]
}

export function MapComponent({ land, landmarks }: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [isMapReady, setIsMapReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Set isClient to true once the component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Clean up function to properly remove the map
  const cleanupMap = () => {
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      } catch (e) {
        console.error("Error cleaning up map:", e)
      }
    }
  }

  // Initialize map when component mounts
  useEffect(() => {
    // Skip if not in browser or ref not available
    if (!isClient || !mapContainerRef.current) return

    // Clean up any existing map first
    cleanupMap()

    try {
      // Check if map container exists and has dimensions
      if (!mapContainerRef.current || mapContainerRef.current.clientHeight === 0) {
        setError("Map container has no height or doesn't exist")
        return
      }

      // Create map instance
      const map = L.map(mapContainerRef.current, {
        center: [land.latitude, land.longitude],
        zoom: 14,
        zoomControl: true,
      })

      // Store the map instance
      mapInstanceRef.current = map

      // Add tile layer
      L.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png", {
        maxZoom: 20,
        attribution:
          '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
      }).addTo(map)

      // Add property marker (red)
      L.circleMarker([land.latitude, land.longitude], {
        radius: 8,
        fillColor: "#ff0000", // Red
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      })
        .addTo(map)
        .bindPopup(`
          <div style="font-weight: 600;">${land.name}</div>
          <div style="font-size: 0.875rem;">Property Location</div>
        `)

      // Add landmark markers (pink)
      landmarks.forEach((landmark) => {
        // Skip invalid landmarks
        if (typeof landmark.latitude !== "number" || typeof landmark.longitude !== "number") {
          return
        }

        L.circleMarker([landmark.latitude, landmark.longitude], {
          radius: 6,
          fillColor: "#00ff00", // Pink
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        })
          .addTo(map)
          .bindPopup(`
            <div style="font-weight: 600;">${landmark.name}</div>
            <div style="font-size: 0.875rem;">${landmark.type}</div>
            <div style="font-size: 0.875rem;">${landmark.distance_km.toFixed(2)} km away</div>
          `)
      })

      // Add a legend
      const legend = L.control({ position: "bottomright" })
      legend.onAdd = () => {
        const div = L.DomUtil.create("div", "info legend")
        div.innerHTML = `
          <div style="background: white; padding: 10px; border-radius: 5px; border: 1px solid #ccc;">
            <div style="margin-bottom: 5px; font-weight: bold;">Legend</div>
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background-color: #ff0000; border: 1px solid #000; margin-right: 5px;"></div>
              <span>Property Location</span>
            </div>
            <div style="display: flex; align-items: center;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background-color: #00ff00; border: 1px solid #000; margin-right: 5px;"></div>
              <span>Landmarks</span>
            </div>
          </div>
        `
        return div
      }
      legend.addTo(map)

      // Force a map refresh after a short delay
      setTimeout(() => {
        map.invalidateSize()
        setIsMapReady(true)
      }, 300)
    } catch (err) {
      console.error("Error initializing map:", err)
      setError("Failed to load map. Please try refreshing the page.")
    }

    // Clean up on unmount
    return () => {
      cleanupMap()
    }
  }, [isClient, land, landmarks])

  // Loading state
  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-[400px] w-full bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-[400px] w-full bg-gray-100 rounded-lg">
        <div className="text-center p-4">
          <p className="text-sm text-red-500">{error}</p>
          <button
            className="mt-2 px-3 py-1 text-sm bg-primary text-white rounded-md"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[400px] w-full">
      <div ref={mapContainerRef} className="h-full w-full rounded-lg border" />
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Initializing map...</p>
          </div>
        </div>
      )}
    </div>
  )
}
