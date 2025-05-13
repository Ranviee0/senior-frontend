"use client";

import type { TempLandDetailOut } from "@/types/data";
import { publishTempLandById } from "@/lib/server-api";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckDetailContent({
  land,
}: {
  land: TempLandDetailOut;
}) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async () => {
    setIsPublishing(true);
    setError(null);
    try {
      const result = await publishTempLandById(land.id);
      alert(`Land published successfully! Land ID: ${result.land_id}`);
      router.push("/"); // adjust redirect if needed
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to publish land.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{land.landName}</h1>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <strong>Area:</strong> {land.area} sqm
        </div>
        <div>
          <strong>Price:</strong> ฿{land.price.toLocaleString()}
        </div>
        <div>
          <strong>Address:</strong> {land.address}
        </div>
        <div>
          <strong>Uploaded:</strong> {land.uploadedAt}
        </div>
        <div>
          <strong>Latitude:</strong> {land.latitude}
        </div>
        <div>
          <strong>Longitude:</strong> {land.longitude}
        </div>
        <div>
          <strong>Zoning:</strong> {land.zoning || "N/A"}
        </div>
        <div>
          <strong>Population Density:</strong> {land.popDensity}
        </div>
        <div>
          <strong>Flood Risk:</strong> {land.floodRisk}
        </div>
        <div>
          <strong>Nearby Dev Plan:</strong> {land.nearbyDevPlan}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-4 mb-2">Description</h2>
        <p>{land.description}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-4 mb-2">Preview Images</h2>
        {land.images.length === 0 ? (
          <p>No images uploaded.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {land.images.map((img) => (
              <img
                key={img.id}
                src={`data:image/png;base64,${img.imageBase64}`}
                alt={`Preview ${img.id}`}
                className="w-full h-auto rounded shadow"
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-6">
        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isPublishing ? "Publishing..." : "Publish this Land"}
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </section>
    </main>
  );
}
