"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getTempLandListings } from "@/lib/server-api"
import type { TempLandListing } from "@/types/data"

export default function CheckPage() {
  const [tempLandListings, setTempLandListings] = useState<TempLandListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const listings = await getTempLandListings()
        setTempLandListings(listings)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch land listings:", err)
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Lands to Be Reviewed</h1>

      {loading ? (
        <p>Loading land listings...</p>
      ) : error ? (
        <div className="p-4 border border-red-300 bg-red-50 rounded-md">
          <p className="text-red-700">Error loading data: {error}</p>
          <p className="mt-2">Please try again later or contact support if the problem persists.</p>
        </div>
      ) : tempLandListings.length === 0 ? (
        <p>No lands waiting for review.</p>
      ) : (
        <ul className="space-y-2">
          {tempLandListings.map((land) => (
            <li key={land.id} className="border rounded p-3 shadow-sm">
              <Link href={`/check/${land.id}`} className="block hover:text-blue-600 hover:underline">
                <p>
                  <strong>Name:</strong> {land.landName}
                </p>
                <p>
                  <strong>Area:</strong> {land.area} sqm
                </p>
                <p>
                  <strong>Price:</strong> ฿{land.price.toLocaleString()}
                </p>
                <p>
                  <strong>Address:</strong> {land.address}
                </p>
                <p>
                  <strong>Uploaded At:</strong> {land.uploadedAt}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
