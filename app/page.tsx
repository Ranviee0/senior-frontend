import { LandListingCard } from "@/components/created/land-listing-card"

// Sample data from the provided JSON
const landListings = [
  {
    id: 1,
    landName: "Ranch",
    description: "Farmland for agriculture, close to Bangkok.",
    area: 100000,
    price: 1999999,
    address: "51 Main St., Phra Borom Maha Ratchawang, Khet Phra Nakhon, Bangkok, 10000",
    images: ["http://localhost:8000/uploaded_files/20250429-075637_1.jpg"],
  },
  {
    id: 2,
    landName: "Urban Land",
    description: "Urban Land at the center of Bangkok",
    area: 10000,
    price: 15000000,
    address: "52 Main St., Phra Borom Maha Ratchawang, Khet Phra Nakhon, Bangkok, 10000",
    images: ["http://localhost:8000/uploaded_files/20250429-082106_1.jpg"],
  },
]

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Land Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {landListings.map((listing) => (
          <LandListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </main>
  )
}
