"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, CircleMarker, useMapEvents, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"

// Component to handle map clicks and update marker position
function MapClickHandler({
  setPosition,
}: {
  setPosition: (lat: number, lng: number) => void
}) {
  useMapEvents({
    click: (e) => {
      setPosition(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

// Component to update map center when coordinates change
function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()

  useEffect(() => {
    map.setView([lat, lng], map.getZoom())
  }, [lat, lng, map])

  return null
}

interface MapComponentProps {
  lat: number
  lng: number
  onPositionChange: (lat: number, lng: number) => void
}

export function MapComponent({ lat, lng, onPositionChange }: MapComponentProps) {
  return (
    <MapContainer center={[lat, lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CircleMarker
        center={[lat, lng]}
        pathOptions={{
          radius: 8,
          color: "red",
          fillColor: "red",
          fillOpacity: 1,
        }}
      />
      <MapClickHandler setPosition={onPositionChange} />
      <MapUpdater lat={lat} lng={lng} />
    </MapContainer>
  )
}
