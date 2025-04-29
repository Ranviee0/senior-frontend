import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { ImageGallery } from "@/components/created/image-gallery"

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

async function getLandDetails(id: string): Promise<LandListing> {
  try {
    const response = await fetch(`http://localhost:8000/lands/${id}`, {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      if (response.status === 404) {
        notFound()
      }
      throw new Error(`Failed to fetch land details: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching land details:", error)
    throw error
  }
}

export default async function LandDetailsPage({ params }: { params: { id: string } }) {
  const land = await getLandDetails(params.id)

  // Parse the nearbyDevPlan string if it's stored as a JSON string
  let nearbyDevelopments: string[] = []
  try {
    nearbyDevelopments = JSON.parse(land.nearbyDevPlan)
  } catch (e) {
    // If parsing fails, use it as a regular string
    nearbyDevelopments = land.nearbyDevPlan ? [land.nearbyDevPlan] : []
  }

  // Format the upload date
  const uploadDate = new Date(
    land.uploadedAt.replace(/(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})/, "$1-$2-$3T$4:$5:$6"),
  )
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(uploadDate)

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
          </div>
        </div>
      </div>
    </div>
  )
}
