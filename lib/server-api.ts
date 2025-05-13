import api from "./api";
import { AxiosError } from "axios";
import type { LandListing } from "@/types/data";
import type { Landmark } from "@/types/data";
import type { TempLandListing } from "@/types/data";

export async function getLandDetail(id: string): Promise<LandListing | null> {
  try {
    const res = await api.get(`/lands/${id}`);
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response?.status === 404) return null;
    throw err; // rethrow for other errors
  }
}

export async function getClosestLandmark(
  id: string
): Promise<Landmark[] | null> {
  try {
    const res = await api.get(`/landmarks/closest-landmarks/${id}`);
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response?.status === 404) return null;
    throw err; // rethrow for other errors
  }
}

export async function getAllLandDetail(): Promise<LandListing[]> {
  try {
    const res = await api.get<LandListing[]>("/lands/");
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response?.status === 404) return [];
    throw error;
  }
}

export async function getTempLandListings(): Promise<TempLandListing[]> {
  try {
    const res = await api.get<TempLandListing[]>("/check/list");
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response?.status === 404) return [];
    throw error;
  }
}