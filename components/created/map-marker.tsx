"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";
import { PannableCircleMarker } from "./pannable";

type Landmark = {
  id: number;
  type: string;
  name: string;
  latitude: number;
  longitude: number;
  distance_km: number;
};

type Land = {
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
};

const landmarks: Landmark[] = [
  {
    id: 98,
    type: "Tourist",
    name: "Grand Palace",
    latitude: 13.75,
    longitude: 100.4913,
    distance_km: 1.333,
  },
  {
    id: 100,
    type: "Tourist",
    name: "Wat Pho",
    latitude: 13.7466,
    longitude: 100.493,
    distance_km: 1.438,
  },
  {
    id: 99,
    type: "Tourist",
    name: "Wat Arun",
    latitude: 13.7437,
    longitude: 100.488,
    distance_km: 2.046,
  },
  {
    id: 106,
    type: "Tourist",
    name: "Chinatown (Yaowarat)",
    latitude: 13.7394,
    longitude: 100.5107,
    distance_km: 2.111,
  },
  {
    id: 103,
    type: "Tourist",
    name: "Jim Thompson House",
    latitude: 13.7513,
    longitude: 100.5284,
    distance_km: 2.926,
  },
];

const land: Land = {
  id: 1,
  landName: "Reimu",
  description: "Reimu Land",
  area: 1000,
  price: 100000,
  address:
    "51 Main, Phra Borom Maha Ratchawang, Khet Phra Nakhon, Bangkok, 41000",
  latitude: 13.7563,
  longitude: 100.5018,
  zoning: "A",
  popDensity: 2863.655700557218,
  floodRisk: "medium",
  nearbyDevPlan: '["A", "B"]',
  uploadedAt: "20250506-163623",
  images: ["http://127.0.0.1:8000/uploaded_files/20250506-163623_1.jpg"],
};

const MapWithCircles = () => {
  const [isClient, setIsClient] = useState(false);
  const landPosition: LatLngExpression = {
    lat: land.latitude,
    lng: land.longitude,
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="h-[400px] w-full">
      {isClient && (
        <MapContainer
          center={landPosition}
          zoom={14}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Land (Red Marker) */}

            <PannableCircleMarker
              position={landPosition}
              popupContent={
                <div>
                  <strong>{land.landName}</strong>
                  <br />
                </div>
              }
              fillColor="#CC0000"
            />


          {/* Landmarks (Blue Markers) */}
          {landmarks.map((lm) => (
            <PannableCircleMarker
              key={lm.id}
              position={{ lat: lm.latitude, lng: lm.longitude }}
              popupContent={
                <div>
                  <strong>{lm.name}</strong>
                  <br />
                  {lm.type} — {lm.distance_km.toFixed(2)} km from land
                </div>
              }
              fillColor="#3388ff"
            />
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default MapWithCircles;
