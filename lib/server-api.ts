import api from "./api";
import type { LandListing } from "@/types/data";
import type { Landmark } from "@/types/data";

export async function getLandDetail(id: string): Promise<LandListing | null> {
  try {
    const res = await api.get(`/lands/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch land data:", err);
    return null;
  }
}

export async function getClosestLandmark(
  id: string
): Promise<Landmark[] | null> {
  try {
    const res = await api.get(`/landmarks/closest-landmarks/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch closest landmark:", err);
    return null;
  }
}
