"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { ImageGallery } from "@/components/created/image-gallery"
import { MapComponent } from "@/components/created/map-component"

interface LandListing {
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

interface Landmark {
  id: number
  type: "MRT" | "BTS" | "CBD" | "Office" | "Condo" | "Tourist"
  name: string
  latitude: number
  longitude: number
  distance_km: number
}

// Function to determine the color based on landmark type - now all pink for consistency with map
export function getLandmarkColor(type: string): string {
  // All landmarks are pink now to match the map
  return "#ec4899" // pink
}

export default function LandDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params Promise using React.use()
  const unwrappedParams = use(params)
  const id = unwrappedParams.id

  const [land, setLand] = useState<LandListing | null>(null)
  const [landmarks, setLandmarks] = useState<Landmark[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchLandDetails() {
      setIsLoading(true)
      try {
        const response = await fetch(`http://localhost:8000/lands/${id}`, {
          cache: "no-store",
        })

        if (!response.ok) {
          if (response.status === 404) {
            router.push("/not-found")
            return
          }
          throw new Error(`Failed to fetch land details: ${response.status}`)
        }

        const data = await response.json()
        setLand(data)
      } catch (error) {
        console.error("Error fetching land details:", error)
        setError("Failed to load property details")
      }
    }

    async function fetchClosestLandmarks() {
      try {
        const response = await fetch(`http://localhost:8000/landmarks/closest-landmarks/${id}`, {
          cache: "no-store",
        })

        if (!response.ok) {
          console.error(`Failed to fetch landmarks: ${response.status}`)
          setLandmarks([])
          return
        }

        const data = await response.json()
        setLandmarks(data)
      } catch (error) {
        console.error("Error fetching landmarks:", error)
        setLandmarks([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchLandDetails()
    fetchClosestLandmarks()
  }, [id, router])

  // If data is loading, show a loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Loading property details...</h1>
        </div>
      </div>
    )
  }

  // If there was an error or land data couldn't be fetched, show an error
  if (error || !land) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Unable to load property details</h1>
          <p className="text-muted-foreground mb-6">
            There was an error loading the property information. Please try again later.
          </p>
          <Link href="/">
            <Button>Return to Listings</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Parse the nearbyDevPlan string if it's stored as a JSON string
  let nearbyDevelopments: string[] = []
  try {
    nearbyDevelopments = JSON.parse(land.nearbyDevPlan)
  } catch (e) {
    // If parsing fails, use it as a regular string
    nearbyDevelopments = land.nearbyDevPlan ? [land.nearbyDevPlan] : []
  }

  // Format the upload date
  let formattedDate = "Unknown"
  try {
    const uploadDate = new Date(
      land.uploadedAt.replace(/(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})/, "$1-$2-$3T$4:$5:$6"),
    )
    formattedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(uploadDate)
  } catch (e) {
    console.error("Error formatting date:", e)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Listings
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column - Images */}
          <div className="lg:col-span-2">
            <ImageGallery images={land.images} landName={land.landName} />

            {/* Map section */}
            <div className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="font-semibold mb-4">Nearby Landmarks</h2>
                  {/* Only render map if we have valid coordinates */}
                  {typeof land.latitude === "number" && typeof land.longitude === "number" ? (
                    <MapComponent
                      land={{
                        id: land.id,
                        name: land.landName,
                        latitude: land.latitude,
                        longitude: land.longitude,
                      }}
                      landmarks={landmarks}
                    />
                  ) : (
                    <div className="h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
                      <p className="text-muted-foreground">Map location unavailable</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right column - Details */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h1 className="text-2xl font-bold mb-2">{land.landName}</h1>
                <div className="text-2xl font-bold text-green-600 mb-4">{formatPrice(land.price)}</div>

                <div className="flex items-start gap-2 text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{land.address}</span>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div>
                    <h2 className="font-semibold mb-2">Description</h2>
                    <p className="text-muted-foreground">{land.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="font-semibold mb-4">Property Details</h2>

                <div className="space-y-3">
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Area</span>
                    <span className="font-medium">{land.area.toLocaleString()} sq.m</span>
                  </div>

                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Zoning</span>
                    <span className="font-medium">{land.zoning}</span>
                  </div>

                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Flood Risk</span>
                    <span className="font-medium capitalize">
                      <Badge
                        variant={
                          land.floodRisk === "high"
                            ? "destructive"
                            : land.floodRisk === "medium"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {land.floodRisk}
                      </Badge>
                    </span>
                  </div>

                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Population Density</span>
                    <span className="font-medium">{land.popDensity.toFixed(2)}/km²</span>
                  </div>

                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Coordinates</span>
                    <span className="font-medium">
                      {land.latitude.toFixed(6)}, {land.longitude.toFixed(6)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Listed On</span>
                    <span className="font-medium">{formattedDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {nearbyDevelopments.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="font-semibold mb-4">Nearby Development Plans</h2>
                  <div className="flex flex-wrap gap-2">
                    {nearbyDevelopments.map((dev, index) => (
                      <Badge key={index} variant="secondary">
                        {dev}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {landmarks.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="font-semibold mb-4">Closest Landmarks</h2>
                  <div className="space-y-3">
                    {landmarks.map((landmark) => (
                      <div
                        key={landmark.id}
                        className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                        data-landmark-id={landmark.id}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ec4899" }} />
                            <span className="font-medium">{landmark.name}</span>
                          </div>
                          <Badge variant="outline">{landmark.type}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {landmark.distance_km.toFixed(2)} km away
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4">
              <Button className="flex-1">Contact Seller</Button>
              <Button variant="outline" className="flex-1">
                Share Listing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
