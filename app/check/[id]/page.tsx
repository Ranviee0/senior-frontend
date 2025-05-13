// app/check/[id]/page.tsx
import { getTempLandById } from "@/lib/server-api";
import type { TempLandDetailOut } from "@/types/data";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function CheckDetailPage({ params }: Props) {
  const id = parseInt(params.id);

  let land: TempLandDetailOut;
  try {
    land = await getTempLandById(id);
  } catch (err) {
    return notFound();
  }

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
    </main>
  );
}
