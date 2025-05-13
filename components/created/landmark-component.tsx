"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";
import { PannableCircleMarker } from "./pannable";
import { cn } from "@/lib/utils";
import type { Landmark } from "@/types/data";
import type { LandListing } from "@/types/data";

// MapController component to access the map instance
const MapController = ({
  selectedPosition,
}: {
  selectedPosition: LatLngExpression | null;
}) => {
  const map = useMap();

  // Fly to selected position when it changes
  useEffect(() => {
    if (selectedPosition) {
      // Use type assertion to tell TypeScript that map has flyTo method
      (map as any).flyTo(selectedPosition, (map as any).getZoom(), {
        animate: true,
      });
    }
  }, [selectedPosition, map]);

  return null;
};

interface LandmarkMapProps {
  landmarks: Landmark[];
  land: LandListing;
  landMarkerColor?: string;
  landmarkMarkerColor?: string;
  selectedLandmarkColor?: string;
}

const LandmarkMap = ({
  landmarks,
  land,
  landMarkerColor = "#CC0000",
  landmarkMarkerColor = "#3388ff",
  selectedLandmarkColor = "#0066cc", // Darker blue for selected landmarks
}: LandmarkMapProps) => {
  const [isClient, setIsClient] = useState(false);
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(
    null
  );
  const [isLandSelected, setIsLandSelected] = useState(false);
  const [selectedPosition, setSelectedPosition] =
    useState<LatLngExpression | null>(null);

  const landPosition: LatLngExpression = {
    lat: land.latitude,
    lng: land.longitude,
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Function to handle landmark selection
  const handleLandmarkSelect = (landmark: Landmark) => {
    setSelectedLandmark(landmark);
    setIsLandSelected(false);

    // Set the selected position to fly to
    const position: LatLngExpression = {
      lat: landmark.latitude,
      lng: landmark.longitude,
    };
    setSelectedPosition(position);
  };

  // Function to handle land selection
  const handleLandSelect = () => {
    // Deselect any selected landmark
    setSelectedLandmark(null);
    setIsLandSelected(true);

    // Set the selected position to the land
    setSelectedPosition(landPosition);
  };

  return (
    <div className="flex flex-col md:flex-row h-[600px] w-full border rounded-lg overflow-hidden">
      {/* Sidebar with landmarks list */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-gray-50 overflow-y-auto border-r">
        <div className="p-4 bg-white border-b">
          <h3 className="font-medium text-lg">Nearby Landmarks</h3>
          <p className="text-sm text-gray-500">
            {landmarks.length} locations found
          </p>
        </div>

        {/* Land item at the top of the list */}
        <div
          className={cn(
            "p-4 cursor-pointer hover:bg-gray-100 transition-colors border-b",
            isLandSelected ? "bg-red-50 border-l-4 border-red-500" : ""
          )}
          onClick={handleLandSelect}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: landMarkerColor }}
              />
            </div>
            <div className="ml-3">
              <p className="font-medium">{land.landName}</p>
              <p className="text-sm text-gray-500">Your Land</p>
              <p className="text-sm text-gray-500">{land.area} sqm</p>
            </div>
          </div>
        </div>

        <div className="py-2 px-4 bg-gray-100 border-b">
          <p className="text-sm font-medium">Nearby Landmarks</p>
        </div>

        <ul className="divide-y">
          {landmarks.map((landmark) => (
            <li
              key={landmark.id}
              onClick={() => handleLandmarkSelect(landmark)}
              className={cn(
                "p-4 cursor-pointer hover:bg-gray-100 transition-colors",
                selectedLandmark?.id === landmark.id
                  ? "bg-blue-50 border-l-4 border-blue-500"
                  : ""
              )}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor:
                        selectedLandmark?.id === landmark.id
                          ? selectedLandmarkColor
                          : landmarkMarkerColor,
                    }}
                  />
                </div>
                <div className="ml-3">
                  <p className="font-medium">{landmark.name}</p>
                  <p className="text-sm text-gray-500">{landmark.type}</p>
                  <p className="text-sm text-gray-500">
                    {landmark.distance_km.toFixed(2)} km away
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Map container */}
      <div className="flex-1 h-full">
        {isClient && (
          <MapContainer
            center={[land.latitude, land.longitude]}
            zoom={14}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            {/* Map controller to handle flying to selected positions */}
            <MapController selectedPosition={selectedPosition} />

            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Land Marker */}
            <PannableCircleMarker
              position={landPosition}
              popupContent={
                <div>
                  <strong>{land.landName}</strong>
                  <br />
                  {land.description}
                  <br />
                  Area: {land.area} sqm
                  <br />
                  Price: ${land.price.toLocaleString()}
                </div>
              }
              fillColor={landMarkerColor}
              radius={isLandSelected ? 12 : 10}
              isSelected={isLandSelected}
              onClick={handleLandSelect}
              openPopupOnSelect={isLandSelected}
            />

            {/* Landmarks Markers */}
            {landmarks.map((landmark) => {
              const isSelected = selectedLandmark?.id === landmark.id;
              return (
                <PannableCircleMarker
                  key={landmark.id}
                  position={{ lat: landmark.latitude, lng: landmark.longitude }}
                  popupContent={
                    <div>
                      <strong>{landmark.name}</strong>
                      <br />
                      {landmark.type} — {landmark.distance_km.toFixed(2)} km
                      from land
                    </div>
                  }
                  fillColor={
                    isSelected ? selectedLandmarkColor : landmarkMarkerColor
                  }
                  radius={isSelected ? 10 : 8}
                  isSelected={isSelected}
                  onClick={() => handleLandmarkSelect(landmark)}
                  openPopupOnSelect={isSelected}
                />
              );
            })}
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default LandmarkMap;
