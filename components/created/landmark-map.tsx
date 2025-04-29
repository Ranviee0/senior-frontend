"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

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

interface LandmarkMapProps {
  land: LandInfo
  landmarks: Landmark[]
}

// Helper function to get color for landmark type - now all pink for consistency
export function getLandmarkColor(type: string): string {
  // All landmarks are pink now
  return "#ec4899" // pink
}

// Loading component
function MapLoading() {
  return (
    <div className="flex items-center justify-center h-[400px] w-full bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  )
}

// Dynamically import the map component to avoid SSR issues
// The "{ ssr: false }" is crucial here
const MapWithNoSSR = dynamic(() => import("@/components/created/simple-map"), {
  ssr: false,
  loading: () => <MapLoading />,
})

export function LandmarkMap({ land, landmarks }: LandmarkMapProps) {
  // Use state to track if we're in the browser
  const [isBrowser, setIsBrowser] = useState(false)
  const [isDataReady, setIsDataReady] = useState(false)

  // Only render the map on the client side and when data is valid
  useEffect(() => {
    setIsBrowser(true)

    // Validate that land and landmarks data is complete
    if (land && land.latitude !== undefined && land.longitude !== undefined) {
      setIsDataReady(true)
    }
  }, [land])

  // Show loading state if not in browser or data isn't ready
  if (!isBrowser || !isDataReady) {
    return <MapLoading />
  }

  return (
    <div className="h-[400px] w-full">
      <MapWithNoSSR land={land} landmarks={landmarks || []} />
    </div>
  )
}
