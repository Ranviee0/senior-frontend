import { notFound } from "next/navigation"
import { ArrowLeft, MapPin, Calendar, AreaChart, Tag, Droplets, Building, Users } from "lucide-react"
import Link from "next/link"
import { formatPrice, formatDate, parseJsonSafely } from "@/lib/utils"
import { ImageGallery } from "@/components/created/image-gallery"
import LandmarkMap from "@/components/created/landmark-component"
import { getLandDetail, getClosestLandmark } from "@/lib/server-api"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface PageProps {
  params: { id: string }
}

export default async function LandDetailPage({ params }: PageProps) {
  const land = await getLandDetail(params.id)
  const closestLandmarks = await getClosestLandmark(params.id)

  if (!land || !closestLandmarks) return notFound()

  // Parse the nearbyDevPlan if it's a JSON string
  const developmentPlans = parseJsonSafely<string[]>(land.nearbyDevPlan)

  return (
    <div className="container mx-auto py-4 px-3 space-y-4">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center text-primary hover:underline text-sm">
        <ArrowLeft className="h-3 w-3 mr-1" />
        Back to listings
      </Link>

      {/* Main content - gallery and details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left column - Image gallery */}
        <div>
          <ImageGallery images={land.images} landName={land.landName} />
        </div>

        {/* Right column - Property details */}
        <div className="space-y-4">
          {/* Title and address */}
          <div>
            <h1 className="text-2xl font-bold">{land.landName}</h1>
            <p className="text-muted-foreground flex items-center text-sm mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {land.address}
            </p>
          </div>

          {/* Price and key details */}
          <div className="bg-gray-50 p-4 rounded-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-2xl font-bold">{formatPrice(land.price)}</p>
                <p className="text-muted-foreground text-sm">{land.area} sq.m.</p>
              </div>
              <Badge variant="outline" className="text-xs">
                ID: {land.id}
              </Badge>
            </div>

            <Separator className="my-3" />

            {/* Property specifications */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-1.5">
                <AreaChart className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Area</p>
                  <p className="text-muted-foreground">{land.area} sq.m.</p>
                </div>
              </div>

              <div className="flex items-start gap-1.5">
                <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Zoning</p>
                  <p className="text-muted-foreground">{land.zoning}</p>
                </div>
              </div>

              <div className="flex items-start gap-1.5">
                <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Population</p>
                  <p className="text-muted-foreground">{land.popDensity} per sq.km.</p>
                </div>
              </div>

              <div className="flex items-start gap-1.5">
                <Droplets className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Flood Risk</p>
                  <p className="text-muted-foreground">{land.floodRisk}</p>
                </div>
              </div>

              <div className="flex items-start gap-1.5">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Listed On</p>
                  <p className="text-muted-foreground">
                    {land.uploadedAt ? formatDate(land.uploadedAt) : "Date unavailable"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-1.5">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Coordinates</p>
                  <p className="text-muted-foreground">
                    {land.latitude.toFixed(6)}, {land.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Development plans */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Nearby Development Plans</h3>
            </div>

            {Array.isArray(developmentPlans) && developmentPlans.length > 0 ? (
              <ul className="list-disc pl-5 space-y-0.5 text-sm">
                {developmentPlans.map((plan, index) => (
                  <li key={index} className="text-muted-foreground">
                    {plan}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No nearby development plans</p>
            )}
          </div>
        </div>
      </div>

      {/* Description section */}
      <div className="py-2">
        <h2 className="text-lg font-semibold mb-2">Property Description</h2>
        <p className="text-sm text-muted-foreground whitespace-pre-line">{land.description}</p>
      </div>

      {/* Map section */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Location & Nearby Landmarks</h2>
        <LandmarkMap land={land} landmarks={closestLandmarks} />
      </div>
    </div>
  )
}
