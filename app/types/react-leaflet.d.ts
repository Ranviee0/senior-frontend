import React from "react"

declare module "react-leaflet" {
  import type { ReactNode } from "react"

  // Common types
  export type LatLngExpression = [number, number] | { lat: number; lng: number }
  export type LatLngBoundsExpression =
    | LatLngExpression[]
    | { getNorthEast: () => LatLngExpression; getSouthWest: () => LatLngExpression }
  export type PointExpression = [number, number] | { x: number; y: number }

  // Leaflet core types
  export interface LatLng {
    lat: number
    lng: number
    equals(otherLatLng: LatLng, maxMargin?: number): boolean
    toString(): string
    distanceTo(otherLatLng: LatLng): number
  }

  export interface LeafletMap {
    setView(center: LatLngExpression, zoom?: number): this
    getZoom(): number
    getCenter(): LatLng
    on(eventName: string, handler: (event: any) => void): this
    off(eventName: string, handler: (event: any) => void): this
  }

  export interface LeafletMarker {
    setLatLng(latlng: LatLngExpression): this
    getLatLng(): LatLng
    on(eventName: string, handler: (event: any) => void): this
    off(eventName: string, handler: (event: any) => void): this
  }

  export interface LeafletTileLayer {
    setUrl(url: string): this
    setOpacity(opacity: number): this
  }

  // Event types
  export interface LeafletMouseEvent {
    latlng: LatLng
    layerPoint: PointExpression
    containerPoint: PointExpression
    originalEvent: MouseEvent
  }

  export interface LeafletDragEndEvent {
    target: LeafletMarker
    type: string
  }

  // Component Props
  export interface MapContainerProps {
    children?: ReactNode
    style?: React.CSSProperties
    className?: string
    id?: string
    zoom?: number
    center?: LatLngExpression
    scrollWheelZoom?: boolean
    whenReady?: () => void
    whenCreated?: (map: LeafletMap) => void
  }

  export interface TileLayerProps {
    attribution?: string
    url: string
    opacity?: number
    zIndex?: number
    className?: string
    children?: ReactNode
  }

  export interface MarkerProps {
    position: LatLngExpression
    icon?: any
    draggable?: boolean
    eventHandlers?: {
      [key: string]: (event: any) => void
    }
    opacity?: number
    zIndexOffset?: number
    children?: ReactNode
  }

  // Components
  export class MapContainer extends React.Component<MapContainerProps> {}
  export class TileLayer extends React.Component<TileLayerProps> {}
  export class Marker extends React.Component<MarkerProps> {}
  export class Popup extends React.Component<any> {}

  // Hooks
  export function useMap(): LeafletMap
  export function useMapEvents(events: { [key: string]: (e: any) => void }): LeafletMap
}
