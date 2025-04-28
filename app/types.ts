export interface Upload {
  land_name: string;
  description: string;
  address: string;
  area: number;
  price: number;
  latitude: number;
  longitude: number;
  zoning: string;
  pop_density: number;
  flood_risk: "low" | "medium" | "high" | "unknown";
  nearby_dev_plan: string[];
}

export interface ProvinceData  {
  "name-en": string
  "name-th": string
  area: number
  population: number
  area_km2: number
}
