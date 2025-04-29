// Simplified declaration file for Leaflet
declare module "leaflet" {
    export interface LatLngExpression {
      lat: number
      lng: number
    }
  
    export interface MapOptions {
      center?: [number, number]
      zoom?: number
      zoomControl?: boolean
      attributionControl?: boolean
    }
  
    export interface TileLayerOptions {
      maxZoom?: number
      attribution?: string
    }
  
    export class Map {
      constructor(element: HTMLElement, options?: MapOptions)
      setView(center: [number, number], zoom: number): this
      remove(): void
      invalidateSize(animate?: boolean): this
    }
  
    export class Layer {
      addTo(map: Map): this
      bindPopup(content: string): this
      openPopup(): this
    }
  
    export class Marker extends Layer {}
    export class TileLayer extends Layer {
      constructor(urlTemplate: string, options?: TileLayerOptions)
    }
  
    export class Control {
      static Zoom: any
    }
  
    export function map(element: HTMLElement, options?: MapOptions): Map
    export function marker(latlng: [number, number]): Marker
    export function tileLayer(urlTemplate: string, options?: TileLayerOptions): TileLayer
  
    export default {
      map,
      marker,
      tileLayer,
      Control,
    }
  }
  