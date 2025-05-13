import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { ImageGallery } from "@/components/created/image-gallery";
import LandmarkMap from "@/components/created/landmark-component";
import { getLandDetail, getClosestLandmark } from "@/lib/server-api";

interface PageProps {
  params: { id: string };
}

export default async function LandDetailPage({ params }: PageProps) {
  const land = await getLandDetail(params.id);
  const closestLandmarks = await getClosestLandmark(params.id);

  if (!land || !closestLandmarks) return notFound();

  return (
    <div className="space-y-4">
      <Link href="/">
        <ArrowLeft className="inline mr-2" />
        Back
      </Link>
      <h1>{land.landName}</h1>
      <p>{land.description}</p>
      <p>{formatPrice(land.price)}</p>
      <ImageGallery images={land.images} landName={land.landName} />
      <LandmarkMap land={land} landmarks={closestLandmarks} />
    </div>
  );
}
