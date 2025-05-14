import Link from "next/link"
import { LandListingCard } from "@/components/created/land-listing-card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { getAllLandDetail, searchLandsByProvince } from "@/lib/server-api"
import { ProvinceSearch } from "@/components/created/province-search"
import type { LandListing } from "@/types/data"

export default async function Home({
  searchParams,
}: {
  searchParams: { province?: string }
}) {
  let landListings: LandListing[] = []

  try {
    if (searchParams.province) {
      // If a province is selected, search lands by that province
      landListings = await searchLandsByProvince(searchParams.province)
    } else {
      // Otherwise, get all land listings
      landListings = await getAllLandDetail()
    }
  } catch (err) {
    console.error("Failed to load land listings:", err)
    // optionally throw notFound() or display a fallback here
  }

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
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-semibold">
              {searchParams.province ? `Land in ${searchParams.province}` : "All Land Listings"}
            </h2>
            <ProvinceSearch />
          </div>
        </div>

        {landListings.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-muted-foreground">
              {searchParams.province
                ? `No land listings found in ${searchParams.province}.`
                : "No land listings found."}
            </p>
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
