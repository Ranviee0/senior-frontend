import Link from "next/link"
import { LandListingCard } from "@/components/created/land-listing-card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface LandListing {
  id: number
  landName: string
  description: string
  area: number
  price: number
  address: string
  latitude?: number
  longitude?: number
  zoning?: string
  popDensity?: number
  floodRisk?: string
  nearbyDevPlan?: string
  uploadedAt?: string
  images: string[]
}

async function getLandListings(): Promise<LandListing[]> {
  try {
    // Add cache control to ensure fresh data
    const response = await fetch("http://localhost:8000/lands/", {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch land listings: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching land listings:", error)
    return []
  }
}

export default async function Home() {
  const landListings = await getLandListings()

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Land Listings</h1>
          <Link href="/upload">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>Upload Land</span>
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        {landListings.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-muted-foreground">No land listings found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-10">
            {landListings.map((listing) => (
              <LandListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
