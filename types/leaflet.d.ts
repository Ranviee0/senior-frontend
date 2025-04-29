// Comprehensive declaration file for Leaflet
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
      scrollWheelZoom?: boolean
      fadeAnimation?: boolean
      zoomAnimation?: boolean
    }
  
    export interface TileLayerOptions {
      maxZoom?: number
      minZoom?: number
      attribution?: string
      errorTileUrl?: string
    }
  
    export interface CircleMarkerOptions {
      radius?: number
      fillColor?: string
      color?: string
      weight?: number
      opacity?: number
      fillOpacity?: number
    }
  
    export interface ControlOptions {
      position?: string
    }
  
    export class Map {
      constructor(element: HTMLElement, options?: MapOptions)
      setView(center: [number, number], zoom: number): this
      remove(): void
      invalidateSize(animate?: boolean): this
      on(event: string, handler: Function): this
      off(event?: string, handler?: Function): this
      eachLayer(callback: (layer: any) => void): this
      removeLayer(layer: any): this
      scrollWheelZoom: {
        enable(): void
        disable(): void
      }
    }
  
    export class Layer {
      addTo(map: Map): this
      bindPopup(content: string): this
      openPopup(): this
      on(event: string, handler: Function): this
      off(event?: string, handler?: Function): this
    }
  
    export class Marker extends Layer {
      constructor(latlng: [number, number], options?: any)
      getLatLng(): { lat: number; lng: number }
    }
  
    export class CircleMarker extends Layer {
      constructor(latlng: [number, number], options?: CircleMarkerOptions)
      getLatLng(): { lat: number; lng: number }
    }
  
    export class TileLayer extends Layer {
      constructor(urlTemplate: string, options?: TileLayerOptions)
    }
  
    export class Control {
      static extend(options: any): any
      constructor(options?: ControlOptions)
      onAdd?(map: Map): HTMLElement
      addTo(map: Map): this
    }
  
    export namespace control {
      function zoom(options?: ControlOptions): Control
      function layers(baseLayers?: any, overlays?: any, options?: ControlOptions): Control
      function scale(options?: ControlOptions): Control
      function attribution(options?: ControlOptions): Control
    }
  
    export namespace DomUtil {
      function create(tagName: string, className?: string): HTMLElement
    }
  
    export function map(element: HTMLElement, options?: MapOptions): Map
    export function marker(latlng: [number, number], options?: any): Marker
    export function circleMarker(latlng: [number, number], options?: CircleMarkerOptions): CircleMarker
    export function tileLayer(urlTemplate: string, options?: TileLayerOptions): TileLayer
    export function control(options?: ControlOptions): Control
  
    // Default export
    const L: {
      map: typeof map
      marker: typeof marker
      circleMarker: typeof circleMarker
      tileLayer: typeof tileLayer
      control: typeof control
      DomUtil: typeof DomUtil
      Control: typeof Control
    }
  
    export default L
  }
  