"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { CircleMarker, Popup, useMap } from "react-leaflet"
import type { LatLngExpression } from "leaflet"

interface PannableCircleMarkerProps {
  position: LatLngExpression
  popupContent: React.ReactNode
  radius?: number
  fillColor?: string
  onClick?: () => void
  isSelected?: boolean
  openPopupOnSelect?: boolean
}

export const PannableCircleMarker = ({
  position,
  popupContent,
  radius = 8,
  fillColor = "#3388ff",
  onClick,
  isSelected = false,
  openPopupOnSelect = false,
}: PannableCircleMarkerProps) => {
  const map = useMap()
  const markerRef = useRef<any>(null)
  const wasSelected = useRef(false)

  const handleClick = () => {
    // Use type assertion to tell TypeScript that map has flyTo method
    ;(map as any).flyTo(position, (map as any).getZoom(), { animate: true })

    // Call the onClick handler if provided
    if (onClick) {
      onClick()
    }
  }

  // Open popup when selected changes from false to true
  useEffect(() => {
    if (openPopupOnSelect && isSelected && !wasSelected.current && markerRef.current) {
      setTimeout(() => {
        if (markerRef.current) {
          markerRef.current.openPopup()
        }
      }, 300)
    }
    wasSelected.current = isSelected
  }, [isSelected, openPopupOnSelect])

  return (
    <CircleMarker
      ref={markerRef}
      center={position}
      radius={isSelected ? radius + 2 : radius}
      pathOptions={{
        fillColor,
        fillOpacity: 0.9,
        color: "#fff",
        weight: isSelected ? 3 : 2,
      }}
      eventHandlers={{
        click: handleClick,
      }}
    >
      <Popup>{popupContent}</Popup>
    </CircleMarker>
  )
}
