// app/check/page.tsx or pages/check.tsx
import { getTempLandListings } from "@/lib/server-api"; // adjust path if needed
import type { TempLandListing } from "@/types/data";

export default async function CheckPage() {
  const tempLandListings: TempLandListing[] = await getTempLandListings();

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Lands to Be Reviewed</h1>
      {tempLandListings.length === 0 ? (
        <p>No lands waiting for review.</p>
      ) : (
        <ul className="space-y-2">
          {tempLandListings.map((land) => (
            <li key={land.id} className="border rounded p-2">
              <p><strong>Name:</strong> {land.landName}</p>
              <p><strong>Area:</strong> {land.area} sqm</p>
              <p><strong>Price:</strong> ฿{land.price.toLocaleString()}</p>
              <p><strong>Address:</strong> {land.address}</p>
              <p><strong>Uploaded At:</strong> {land.uploadedAt}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
