export interface LandListing {
  id: number;
  landName: string;
  description: string;
  area: number;
  price: number;
  address: string;
  latitude: number;
  longitude: number;
  zoning: string;
  popDensity: number;
  floodRisk: string;
  nearbyDevPlan: string;
  uploadedAt: string;
  images: string[];
}

export interface TempLandListing {
  id: number;
  landName: string;
  description: string;
  area: number;
  price: number;
  address: string;
  latitude: number;
  longitude: number;
  zoning: string;
  popDensity: number;
  floodRisk: string;
  nearbyDevPlan: string;
  uploadedAt: string;
  images: string[];
}

export interface TempLandImageOut {
  id: number;
  imageBase64: string;
}

export interface TempLandDetailOut {
  id: number;
  landName: string;
  description: string;
  area: number;
  price: number;
  address: string;
  latitude: number;
  longitude: number;
  zoning?: string;
  popDensity: number;
  floodRisk: string;
  nearbyDevPlan: string;
  uploadedAt: string;
  images: TempLandImageOut[];
}

export interface Landmark {
  id: number;
  type: "MRT" | "BTS" | "CBD" | "Office" | "Condo" | "Tourist";
  name: string;
  latitude: number;
  longitude: number;
  distance_km: number;
}