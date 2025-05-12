"use client"

import LandmarkMap, { type Landmark, type Land } from "@/components/created/landmark-component"

export default function Home() {
  // Example data - you would typically fetch this from an API
  const exampleLandmarks: Landmark[] = [
    {
      id: 98,
      type: "Tourist",
      name: "Grand Palace",
      latitude: 13.75,
      longitude: 100.4913,
      distance_km: 1.333,
    },
    {
      id: 100,
      type: "Tourist",
      name: "Wat Pho",
      latitude: 13.7466,
      longitude: 100.493,
      distance_km: 1.438,
    },
    {
      id: 99,
      type: "Tourist",
      name: "Wat Arun",
      latitude: 13.7437,
      longitude: 100.488,
      distance_km: 2.046,
    },
    {
      id: 106,
      type: "Tourist",
      name: "Chinatown (Yaowarat)",
      latitude: 13.7394,
      longitude: 100.5107,
      distance_km: 2.111,
    },
    {
      id: 103,
      type: "Tourist",
      name: "Jim Thompson House",
      latitude: 13.7513,
      longitude: 100.5284,
      distance_km: 2.926,
    },
    {
      id: 107,
      type: "Shopping",
      name: "MBK Center",
      latitude: 13.7455,
      longitude: 100.5296,
      distance_km: 3.112,
    },
    {
      id: 108,
      type: "Shopping",
      name: "Siam Paragon",
      latitude: 13.7466,
      longitude: 100.5347,
      distance_km: 3.421,
    },
  ]

  const exampleLand: Land = {
    id: 1,
    landName: "Reimu Land",
    description: "Prime real estate in Bangkok",
    area: 1000,
    price: 100000,
    address: "51 Main, Phra Borom Maha Ratchawang, Khet Phra Nakhon, Bangkok, 41000",
    latitude: 13.7563,
    longitude: 100.5018,
    zoning: "A",
    popDensity: 2863.655700557218,
    floodRisk: "medium",
    nearbyDevPlan: '["A", "B"]',
    uploadedAt: "20250506-163623",
    images: ["http://example.com/image.jpg"],
  }

  return (
    <main className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Land and Landmarks Map</h1>
      <p className="text-gray-600 mb-6">
        Click on a landmark in the list or on the map to highlight it and center the map view.
      </p>

      <LandmarkMap
        landmarks={exampleLandmarks}
        land={exampleLand}
        landMarkerColor="#CC0000"
        landmarkMarkerColor="#3388ff"
        highlightedMarkerColor="#32CD32"
      />
    </main>
  )
}
