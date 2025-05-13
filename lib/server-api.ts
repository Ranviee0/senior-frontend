import api from "./api";
import type { LandListing } from "@/types/data";

export async function getLandDetail(id: string): Promise<LandListing | null> {
  try {
    const res = await api.get(`/land/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch land data:", err);
    return null;
  }
}
