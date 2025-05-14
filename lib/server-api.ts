import api from "./api";
import { AxiosError } from "axios";
import type { LandListing } from "@/types/data";
import type { Landmark } from "@/types/data";
import type { TempLandListing } from "@/types/data";
import type { TempLandDetailOut } from "@/types/data";
import { NextRequest, NextResponse } from "next/server";

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

export async function getTempLandById(id: number): Promise<TempLandDetailOut> {
  try {
    const res = await api.get<TempLandDetailOut>(`/check/list/${id}`);
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response?.status === 404) {
      throw new Error("Not Found");
    }
    throw error;
  }
}

export async function publishTempLandById(id: number): Promise<{ land_id: number }> {
  try {
    const res = await api.post<{ land_id: number }>(`/check/publish/${id}`);
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response?.status === 404) {
      throw new Error("TempLand not found");
    }
    throw error;
  }
}

export async function rejectTempLandById(id: number): Promise<void> {
  try {
    await api.delete(`/check/reject/${id}`);
  } catch (err) {
    const error = err as AxiosError;
    if (error.response?.status === 404) {
      throw new Error("TempLand not found");
    }
    throw error;
  }
}

export async function searchLandsByProvince(province: string): Promise<LandListing[]> {
  try {
    const res = await api.get(`/lands/search?search=${encodeURIComponent(province)}`)
    return res.data
  } catch (err) {
    console.error("Error searching lands by province:", err)
    return []
  }
}
