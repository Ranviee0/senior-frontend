interface Landmark {
  id: number;
  type: "MRT" | "BTS" | "CBD" | "Office" | "Condo" | "Tourist";
  name: string;
  latitude: number;
  longitude: number;
  distance_km: number;
}

interface LandInfo {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

interface MapComponentProps {
  land: LandInfo;
  landmarks: Landmark[];
}

export function MapComponent({land, landmarks}: MapComponentProps){

}