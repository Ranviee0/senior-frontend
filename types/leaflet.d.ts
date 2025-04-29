// Comprehensive Leaflet type definitions
declare module "leaflet" {
  // Core classes
  export class Map {
    constructor(element: HTMLElement | string, options?: MapOptions);
    setView(center: LatLngExpression, zoom: number, options?: ZoomPanOptions): this;
    setZoom(zoom: number, options?: ZoomPanOptions): this;
    addLayer(layer: Layer): this;
    removeLayer(layer: Layer): this;
    hasLayer(layer: Layer): boolean;
    eachLayer(fn: (layer: Layer) => void, context?: any): this;
    openPopup(popup: Popup): this;
    closePopup(popup?: Popup): this;
    addControl(control: Control): this;
    removeControl(control: Control): this;
    invalidateSize(options?: { animate?: boolean, pan?: boolean }): this;
    fitBounds(bounds: LatLngBoundsExpression, options?: FitBoundsOptions): this;
    getBounds(): LatLngBounds;
    getCenter(): LatLng;
    getZoom(): number;
    getMinZoom(): number;
    getMaxZoom(): number;
    getSize(): Point;
    panTo(latlng: LatLngExpression, options?: PanOptions): this;
    panBy(offset: PointExpression, options?: PanOptions): this;
    flyTo(latlng: LatLngExpression, zoom?: number, options?: ZoomPanOptions): this;
    flyToBounds(bounds: LatLngBoundsExpression, options?: FitBoundsOptions): this;
    remove(): this;
    getContainer(): HTMLElement;
    getPixelBounds(): Bounds;
    getPixelOrigin(): Point;
    getPixelWorldBounds(zoom?: number): Bounds;
    getZoomScale(toZoom: number, fromZoom: number): number;
    getScaleZoom(scale: number, fromZoom: number): number;
    project(latlng: LatLngExpression, zoom: number): Point;
    unproject(point: PointExpression, zoom: number): LatLng;
    layerPointToLatLng(point: PointExpression): LatLng;
    latLngToLayerPoint(latlng: LatLngExpression): Point;
    wrapLatLng(latlng: LatLngExpression): LatLng;
    distance(latlng1: LatLngExpression, latlng2: LatLngExpression): number;
    containerPointToLayerPoint(point: PointExpression): Point;
    containerPointToLatLng(point: PointExpression): LatLng;
    layerPointToContainerPoint(point: PointExpression): Point;
    latLngToContainerPoint(latlng: LatLngExpression): Point;
    mouseEventToContainerPoint(ev: MouseEvent): Point;
    mouseEventToLayerPoint(ev: MouseEvent): Point;
    mouseEventToLatLng(ev: MouseEvent): LatLng;
    locate(options?: LocateOptions): this;
    stopLocate(): this;
    on(type: string, fn: LeafletEventHandlerFn, context?: any): this;
    once(type: string, fn: LeafletEventHandlerFn, context?: any): this;
    off(type: string, fn?: LeafletEventHandlerFn, context?: any): this;
    fire(type: string, data?: any, propagate?: boolean): this;
    scrollWheelZoom: {
      enable(): void;
      disable(): void;
    };
  }

  export class Layer {
    constructor(options?: LayerOptions);
    addTo(map: Map | LayerGroup): this;
    remove(): this;
    removeFrom(map: Map | LayerGroup): this;
    getPane(name?: string): HTMLElement | undefined;
    bindPopup(content: ((layer: Layer) => Content) | Content | Popup, options?: PopupOptions): this;
    unbindPopup(): this;
    openPopup(latlng?: LatLngExpression): this;
    closePopup(): this;
    togglePopup(): this;
    isPopupOpen(): boolean;
    setPopupContent(content: Content | Popup): this;
    getPopup(): Popup | undefined;
    bindTooltip(content: ((layer: Layer) => Content) | Content | Tooltip, options?: TooltipOptions): this;
    unbindTooltip(): this;
    openTooltip(latlng?: LatLngExpression): this;
    closeTooltip(): this;
    toggleTooltip(): this;
    isTooltipOpen(): boolean;
    setTooltipContent(content: Content | Tooltip): this;
    getTooltip(): Tooltip | undefined;
    onAdd(map: Map): this;
    onRemove(map: Map): this;
    getEvents(): { [name: string]: LeafletEventHandlerFn };
    getAttribution(): string | null;
    beforeAdd(map: Map): this;
    on(type: string, fn: LeafletEventHandlerFn, context?: any): this;
    once(type: string, fn: LeafletEventHandlerFn, context?: any): this;
    off(type: string, fn?: LeafletEventHandlerFn, context?: any): this;
    fire(type: string, data?: any, propagate?: boolean): this;
  }

  export class Marker extends Layer {
    constructor(latlng: LatLngExpression, options?: MarkerOptions);
    toGeoJSON(precision?: number): any;
    getLatLng(): LatLng;
    setLatLng(latlng: LatLngExpression): this;
    setZIndexOffset(offset: number): this;
    getIcon(): Icon;
    setIcon(icon: Icon | DivIcon): this;
    setOpacity(opacity: number): this;
    getElement(): HTMLElement | undefined;
    dragging?: Handler;
  }

  export class CircleMarker extends Path {
    constructor(latlng: LatLngExpression, options?: CircleMarkerOptions);
    toGeoJSON(precision?: number): any;
    setLatLng(latlng: LatLngExpression): this;
    getLatLng(): LatLng;
    setRadius(radius: number): this;
    getRadius(): number;
  }

  export class Circle extends CircleMarker {
    constructor(latlng: LatLngExpression, options?: CircleOptions);
    constructor(latlng: LatLngExpression, radius: number, options?: CircleOptions);
    getBounds(): LatLngBounds;
  }

  export class Polyline extends Path {
    constructor(latlngs: LatLngExpression[] | LatLngExpression[][], options?: PolylineOptions);
    toGeoJSON(precision?: number): any;
    getLatLngs(): LatLng[] | LatLng[][] | LatLng[][][];
    setLatLngs(latlngs: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][]): this;
    isEmpty(): boolean;
    getCenter(): LatLng;
    getBounds(): LatLngBounds;
    addLatLng(latlng: LatLngExpression | LatLngExpression[], latlngs?: LatLng[]): this;
  }

  export class Polygon extends Polyline {
    constructor(latlngs: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][], options?: PolylineOptions);
  }

  export class Rectangle extends Polygon {
    constructor(latLngBounds: LatLngBoundsExpression, options?: PolylineOptions);
    setBounds(latLngBounds: LatLngBoundsExpression): this;
  }

  export class Path extends Layer {
    constructor(options?: PathOptions);
    redraw(): this;
    setStyle(style: PathOptions): this;
    bringToFront(): this;
    bringToBack(): this;
    getElement(): Element | undefined;
  }

  export class TileLayer extends GridLayer {
    constructor(urlTemplate: string, options?: TileLayerOptions);
    setUrl(url: string, noRedraw?: boolean): this;
    getTileUrl(coords: Point): string;
  }

  export class GridLayer extends Layer {
    constructor(options?: GridLayerOptions);
    bringToFront(): this;
    bringToBack(): this;
    getContainer(): HTMLElement | null;
    setOpacity(opacity: number): this;
    setZIndex(zIndex: number): this;
    isLoading(): boolean;
    redraw(): this;
    getTileSize(): Point;
  }

  export class LayerGroup extends Layer {
    constructor(layers?: Layer[], options?: LayerOptions);
    addLayer(layer: Layer): this;
    removeLayer(layer: Layer | number): this;
    hasLayer(layer: Layer): boolean;
    clearLayers(): this;
    invoke(methodName: string, ...params: any[]): this;
    eachLayer(fn: (layer: Layer) => void, context?: any): this;
    getLayer(id: number): Layer | undefined;
    getLayers(): Layer[];
    setZIndex(zIndex: number): this;
    getLayerId(layer: Layer): number;
  }

  export class FeatureGroup extends LayerGroup {
    constructor(layers?: Layer[], options?: LayerOptions);
    setStyle(style: PathOptions): this;
    bringToFront(): this;
    bringToBack(): this;
    getBounds(): LatLngBounds;
  }

  export class GeoJSON extends FeatureGroup {
    constructor(geojson?: any, options?: GeoJSONOptions);
    addData(data: any): this;
    resetStyle(layer?: Layer): this;
    setStyle(style: PathOptions | StyleFunction): this;
  }

  export class Control {
    constructor(options?: ControlOptions);
    getPosition(): string;
    setPosition(position: string): this;
    getContainer(): HTMLElement | undefined;
    addTo(map: Map): this;
    remove(): this;
    onAdd(map: Map): HTMLElement;
    onRemove(map: Map): void;
  }

  export class Icon {
    constructor(options: IconOptions);
    createIcon(oldIcon?: HTMLElement): HTMLElement;
    createShadow(oldIcon?: HTMLElement): HTMLElement;
  }

  export class DivIcon extends Icon {
    constructor(options?: DivIconOptions);
  }

  export class Popup extends Layer {
    constructor(options?: PopupOptions, source?: Layer);
    getLatLng(): LatLng | undefined;
    setLatLng(latlng: LatLngExpression): this;
    getContent(): Content | ((source: Layer) => Content) | undefined;
    setContent(content: Content | ((source: Layer) => Content)): this;
    getElement(): HTMLElement | undefined;
    update(): void;
    isOpen(): boolean;
    bringToFront(): this;
    bringToBack(): this;
  }

  export class Tooltip extends Layer {
    constructor(options?: TooltipOptions, source?: Layer);
    setOpacity(val: number): void;
    getLatLng(): LatLng | undefined;
    setLatLng(latlng: LatLngExpression): this;
    getContent(): Content | undefined;
    setContent(content: Content | ((source: Layer) => Content)): this;
    getElement(): HTMLElement | undefined;
    update(): void;
    isOpen(): boolean;
    bringToFront(): this;
    bringToBack(): this;
  }

  export class LatLng {
    constructor(latitude: number, longitude: number, altitude?: number);
    equals(otherLatLng: LatLngExpression, maxMargin?: number): boolean;
    toString(): string;
    distanceTo(otherLatLng: LatLngExpression): number;
    wrap(): LatLng;
    toBounds(sizeInMeters: number): LatLngBounds;
    lat: number;
    lng: number;
    alt?: number;
  }

  export class LatLngBounds {
    constructor(southWest: LatLngExpression, northEast: LatLngExpression);
    constructor(latlngs: LatLngExpression[]);
    extend(latlng: LatLngExpression | LatLngBoundsExpression): this;
    pad(bufferRatio: number): LatLngBounds;
    getCenter(): LatLng;
    getSouthWest(): LatLng;
    getNorthEast(): LatLng;
    getNorthWest(): LatLng;
    getSouthEast(): LatLng;
    getWest(): number;
    getSouth(): number;
    getEast(): number;
    getNorth(): number;
    contains(latLngOrBounds: LatLngExpression | LatLngBoundsExpression): boolean;
    intersects(otherBounds: LatLngBoundsExpression): boolean;
    overlaps(otherBounds: BoundsExpression): boolean;
    toBBoxString(): string;
    equals(otherBounds: LatLngBoundsExpression, maxMargin?: number): boolean;
    isValid(): boolean;
  }

  export class Point {
    constructor(x: number, y: number, round?: boolean);
    clone(): Point;
    add(otherPoint: PointExpression): Point;
    subtract(otherPoint: PointExpression): Point;
    divideBy(num: number): Point;
    multiplyBy(num: number): Point;
    scaleBy(scale: PointExpression): Point;
    unscaleBy(scale: PointExpression): Point;
    round(): Point;
    floor(): Point;
    ceil(): Point;
    distanceTo(otherPoint: PointExpression): number;
    equals(otherPoint: PointExpression): boolean;
    contains(otherPoint: PointExpression): boolean;
    toString(): string;
    x: number;
    y: number;
  }

  export class Bounds {
    constructor(a: PointExpression, b?: PointExpression);
    extend(point: PointExpression): this;
    getCenter(round?: boolean): Point;
    getBottomLeft(): Point;
    getTopRight(): Point;
    getTopLeft(): Point;
    getBottomRight(): Point;
    getSize(): Point;
    contains(pointOrBounds: PointExpression | BoundsExpression): boolean;
    intersects(otherBounds: BoundsExpression): boolean;
    overlaps(otherBounds: BoundsExpression): boolean;
    isValid(): boolean;
    min?: Point;
    max?: Point;
  }

  export class Handler {
    constructor(map: Map);
    enable(): this;
    disable(): this;
    enabled(): boolean;
    addHooks(): void;
    removeHooks(): void;
  }

  // Utility namespaces
  export namespace DomUtil {
    function get(id: string): HTMLElement | null;
    function getStyle(el: HTMLElement, styleAttrib: string): string;
    function create(tagName: string, className?: string, container?: HTMLElement): HTMLElement;
    function remove(el: HTMLElement): void;
    function empty(el: HTMLElement): void;
    function toFront(el: HTMLElement): void;
    function toBack(el: HTMLElement): void;
    function hasClass(el: HTMLElement, name: string): boolean;
    function addClass(el: HTMLElement, name: string): void;
    function removeClass(el: HTMLElement, name: string): void;
    function setClass(el: HTMLElement, name: string): void;
    function getClass(el: HTMLElement): string;
    function setOpacity(el: HTMLElement, opacity: number): void;
    function testProp(props: string[]): string | false;
    function setTransform(el: HTMLElement, offset: Point, scale?: number): void;
    function setPosition(el: HTMLElement, position: Point): void;
    function getPosition(el: HTMLElement): Point;
    function disableTextSelection(): void;
    function enableTextSelection(): void;
    function disableImageDrag(): void;
    function enableImageDrag(): void;
    function preventOutline(el: HTMLElement): void;
    function restoreOutline(): void;
  }

  export namespace DomEvent {
    function on(el: HTMLElement, types: string, fn: EventHandlerFn, context?: any): typeof DomEvent;
    function on(el: HTMLElement, eventMap: { [eventName: string]: EventHandlerFn }, context?: any): typeof DomEvent;
    function off(el: HTMLElement, types: string, fn: EventHandlerFn, context?: any): typeof DomEvent;
    function off(el: HTMLElement, eventMap: { [eventName: string]: EventHandlerFn }, context?: any): typeof DomEvent;
    function stopPropagation(ev: Event): typeof DomEvent;
    function disableScrollPropagation(el: HTMLElement): typeof DomEvent;
    function disableClickPropagation(el: HTMLElement): typeof DomEvent;
    function preventDefault(ev: Event): typeof DomEvent;
    function stop(ev: Event): typeof DomEvent;
    function getMousePosition(ev: MouseEvent, container?: HTMLElement): Point;
    function getWheelDelta(ev: Event): number;
    function addListener(el: HTMLElement, types: string, fn: EventHandlerFn, context?: any): typeof DomEvent;
    function removeListener(el: HTMLElement, types: string, fn: EventHandlerFn, context?: any): typeof DomEvent;
  }

  export namespace control {
    function zoom(options?: ZoomOptions): Control.Zoom;
    function attribution(options?: AttributionOptions): Control.Attribution;
    function layers(baseLayers?: { [name: string]: Layer }, overlays?: { [name: string]: Layer }, options?: LayersOptions): Control.Layers;
    function scale(options?: ScaleOptions): Control.Scale;
  }

  // Control classes
  export namespace Control {
    class Zoom extends Control {
      constructor(options?: ZoomOptions);
      onAdd(map: Map): HTMLElement;
      onRemove(map: Map): void;
    }

    class Attribution extends Control {
      constructor(options?: AttributionOptions);
      setPrefix(prefix: string): this;
      addAttribution(text: string): this;
      removeAttribution(text: string): this;
      onAdd(map: Map): HTMLElement;
      onRemove(map: Map): void;
    }

    class Layers extends Control {
      constructor(baseLayers?: { [name: string]: Layer }, overlays?: { [name: string]: Layer }, options?: LayersOptions);
      addBaseLayer(layer: Layer, name: string): this;
      addOverlay(layer: Layer, name: string): this;
      removeLayer(layer: Layer): this;
      expand(): this;
      collapse(): this;
      onAdd(map: Map): HTMLElement;
      onRemove(map: Map): void;
    }

    class Scale extends Control {
      constructor(options?: ScaleOptions);
      onAdd(map: Map): HTMLElement;
      onRemove(map: Map): void;
    }
  }

  // Interface definitions
  export interface MapOptions {
    preferCanvas?: boolean;
    attributionControl?: boolean;
    zoomControl?: boolean;
    closePopupOnClick?: boolean;
    zoomSnap?: number;
    zoomDelta?: number;
    trackResize?: boolean;
    boxZoom?: boolean;
    doubleClickZoom?: boolean | string;
    dragging?: boolean;
    crs?: CRS;
    center?: LatLngExpression;
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    layers?: Layer[];
    maxBounds?: LatLngBoundsExpression;
    renderer?: Renderer;
    inertia?: boolean;
    inertiaDeceleration?: number;
    inertiaMaxSpeed?: number;
    easeLinearity?: number;
    worldCopyJump?: boolean;
    maxBoundsViscosity?: number;
    keyboard?: boolean;
    keyboardPanDelta?: number;
    scrollWheelZoom?: boolean | string;
    wheelDebounceTime?: number;
    wheelPxPerZoomLevel?: number;
    tap?: boolean;
    tapTolerance?: number;
    touchZoom?: boolean | string;
    bounceAtZoomLimits?: boolean;
    fadeAnimation?: boolean;
    zoomAnimation?: boolean;
    zoomAnimationThreshold?: number;
    markerZoomAnimation?: boolean;
    transform3DLimit?: number;
  }

  export interface ZoomPanOptions {
    animate?: boolean;
    duration?: number;
    easeLinearity?: number;
    noMoveStart?: boolean;
  }

  export interface PanOptions {
    animate?: boolean;
    duration?: number;
    easeLinearity?: number;
    noMoveStart?: boolean;
  }

  export interface FitBoundsOptions extends ZoomPanOptions {
    paddingTopLeft?: PointExpression;
    paddingBottomRight?: PointExpression;
    padding?: PointExpression;
    maxZoom?: number;
  }

  export interface LocateOptions {
    watch?: boolean;
    setView?: boolean;
    maxZoom?: number;
    timeout?: number;
    maximumAge?: number;
    enableHighAccuracy?: boolean;
  }

  export interface LayerOptions {
    pane?: string;
    attribution?: string;
  }

  export interface MarkerOptions extends LayerOptions {
    icon?: Icon | DivIcon;
    keyboard?: boolean;
    title?: string;
    alt?: string;
    zIndexOffset?: number;
    opacity?: number;
    riseOnHover?: boolean;
    riseOffset?: number;
    draggable?: boolean;
    autoPan?: boolean;
    autoPanPadding?: PointExpression;
    autoPanSpeed?: number;
  }

  export interface PathOptions extends LayerOptions {
    stroke?: boolean;
    color?: string;
    weight?: number;
    opacity?: number;
    lineCap?: string;
    lineJoin?: string;
    dashArray?: string | number[];
    dashOffset?: string;
    fill?: boolean;
    fillColor?: string;
    fillOpacity?: number;
    fillRule?: string;
    renderer?: Renderer;
    className?: string;
    interactive?: boolean;
    bubblingMouseEvents?: boolean;
  }

  export interface CircleMarkerOptions extends PathOptions {
    radius?: number;
  }

  export interface CircleOptions extends CircleMarkerOptions {
    radius?: number;
  }

  export interface PolylineOptions extends PathOptions {
    smoothFactor?: number;
    noClip?: boolean;
  }

  export interface TileLayerOptions extends GridLayerOptions {
    minZoom?: number;
    maxZoom?: number;
    maxNativeZoom?: number;
    minNativeZoom?: number;
    subdomains?: string | string[];
    errorTileUrl?: string;
    zoomOffset?: number;
    tms?: boolean;
    zoomReverse?: boolean;
    detectRetina?: boolean;
    crossOrigin?: boolean | string;
    tileSize?: number | Point;
    opacity?: number;
    updateWhenIdle?: boolean;
    updateWhenZooming?: boolean;
    updateInterval?: number;
    zIndex?: number;
    bounds?: LatLngBoundsExpression;
    noWrap?: boolean;
    pane?: string;
    className?: string;
    keepBuffer?: number;
    attribution?: string;
  }

  export interface GridLayerOptions extends LayerOptions {
    tileSize?: number | Point;
    opacity?: number;
    updateWhenIdle?: boolean;
    updateWhenZooming?: boolean;
    updateInterval?: number;
    zIndex?: number;
    bounds?: LatLngBoundsExpression;
    minZoom?: number;
    maxZoom?: number;
    minNativeZoom?: number;
    maxNativeZoom?: number;
    noWrap?: boolean;
    pane?: string;
    className?: string;
    keepBuffer?: number;
  }

  export interface GeoJSONOptions extends LayerOptions {
    pointToLayer?: (feature: any, latlng: LatLng) => Layer;
    style?: PathOptions | StyleFunction;
    onEachFeature?: (feature: any, layer: Layer) => void;
    filter?: (feature: any) => boolean;
    coordsToLatLng?: (coords: [number, number] | [number, number, number]) => LatLng;
  }

  export interface ControlOptions {
    position?: string;
  }

  export interface ZoomOptions extends ControlOptions {
    zoomInText?: string;
    zoomInTitle?: string;
    zoomOutText?: string;
    zoomOutTitle?: string;
  }

  export interface AttributionOptions extends ControlOptions {
    prefix?: string | boolean;
  }

  export interface LayersOptions extends ControlOptions {
    collapsed?: boolean;
    autoZIndex?: boolean;
    hideSingleBase?: boolean;
    sortLayers?: boolean;
    sortFunction?: (layerA: Layer, layerB: Layer, nameA: string, nameB: string) => number;
  }

  export interface ScaleOptions extends ControlOptions {
    maxWidth?: number;
    metric?: boolean;
    imperial?: boolean;
    updateWhenIdle?: boolean;
  }

  export interface IconOptions {
    iconUrl: string;
    iconRetinaUrl?: string;
    iconSize?: PointExpression;
    iconAnchor?: PointExpression;
    popupAnchor?: PointExpression;
    tooltipAnchor?: PointExpression;
    shadowUrl?: string;
    shadowRetinaUrl?: string;
    shadowSize?: PointExpression;
    shadowAnchor?: PointExpression;
    className?: string;
  }

  export interface DivIconOptions {
    html?: string | HTMLElement | false;
    bgPos?: PointExpression;
    iconSize?: PointExpression;
    iconAnchor?: PointExpression;
    popupAnchor?: PointExpression;
    tooltipAnchor?: PointExpression;
    className?: string;
  }

  export interface PopupOptions extends LayerOptions {
    maxWidth?: number;
    minWidth?: number;
    maxHeight?: number;
    autoPan?: boolean;
    autoPanPaddingTopLeft?: PointExpression;
    autoPanPaddingBottomRight?: PointExpression;
    autoPanPadding?: PointExpression;
    keepInView?: boolean;
    closeButton?: boolean;
    autoClose?: boolean;
    closeOnEscapeKey?: boolean;
    closeOnClick?: boolean;
    className?: string;
  }

  export interface TooltipOptions extends LayerOptions {
    offset?: PointExpression;
    direction?: string;
    permanent?: boolean;
    sticky?: boolean;
    interactive?: boolean;
    opacity?: number;
    className?: string;
  }

  // Type aliases
  export type LatLngExpression = LatLng | [number, number] | [number, number, number] | { lat: number; lng: number; alt?: number };
  export type LatLngBoundsExpression = LatLngBounds | LatLngExpression[] | [[number, number], [number, number]];
  export type PointExpression = Point | [number, number];
  export type BoundsExpression = Bounds | [PointExpression, PointExpression];
  export type Content = string | HTMLElement;
  export type LeafletEventHandlerFn = (event: LeafletEvent) => void;
  export type EventHandlerFn = (event: Event) => void;
  export type StyleFunction = (feature?: any) => PathOptions;
  export type CRS = any;
  export type Renderer = any;
  export type LeafletEvent = any;

  // Function exports
  export function map(element: string | HTMLElement, options?: MapOptions): Map;
  export function tileLayer(urlTemplate: string, options?: TileLayerOptions): TileLayer;
  export function marker(latlng: LatLngExpression, options?: MarkerOptions): Marker;
  export function circleMarker(latlng: LatLngExpression, options?: CircleMarkerOptions): CircleMarker;
  export function circle(latlng: LatLngExpression, options?: CircleOptions): Circle;
  export function circle(latlng: LatLngExpression, radius: number, options?: CircleOptions): Circle;
  export function polygon(latlngs: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][], options?: PolylineOptions): Polygon;
  export function polyline(latlngs: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][], options?: PolylineOptions): Polyline;
  export function rectangle(bounds: LatLngBoundsExpression, options?: PolylineOptions): Rectangle;
  export function layerGroup(layers?: Layer[], options?: LayerOptions): LayerGroup;
  export function featureGroup(layers?: Layer[], options?: LayerOptions): FeatureGroup;
  export function geoJSON(geojson?: any, options?: GeoJSONOptions): GeoJSON;
  export function latLng(latitude: number, longitude: number, altitude?: number): LatLng;
  export function latLngBounds(southWest: LatLngExpression, northEast: LatLngExpression): LatLngBounds;
  export function latLngBounds(latlngs: LatLngExpression[]): LatLngBounds;
  export function point(x: number, y: number, round?: boolean): Point;
  export function bounds(a: PointExpression, b?: PointExpression): Bounds;
  export function icon(options: IconOptions): Icon;
  export function divIcon(options?: DivIconOptions): DivIcon;
  export function popup(options?: PopupOptions, source?: Layer): Popup;
  export function tooltip(options?: TooltipOptions, source?: Layer): Tooltip;
  export function control(options?: ControlOptions): Control;

  // Default export
  const L: {
    map: typeof map;
    tileLayer: typeof tileLayer;
    marker: typeof marker;
    circleMarker: typeof circleMarker;
    circle: typeof circle;
    polygon: typeof polygon;
    polyline: typeof polyline;
    rectangle: typeof rectangle;
    layerGroup: typeof layerGroup;
    featureGroup: typeof featureGroup;
    geoJSON: typeof geoJSON;
    latLng: typeof latLng;
    latLngBounds: typeof latLngBounds;
    point: typeof point;
    bounds: typeof bounds;
    icon: typeof icon;
    divIcon: typeof divIcon;
    popup: typeof popup;
    tooltip: typeof tooltip;
    control: typeof control;
    DomUtil: typeof DomUtil;
    DomEvent: typeof DomEvent;
    Control: typeof Control;
    Layer: typeof Layer;
    Map: typeof Map;
    Icon: typeof Icon;
    Marker: typeof Marker;
    CircleMarker: typeof CircleMarker;
    Circle: typeof Circle;
    Polyline: typeof Polyline;
    Polygon: typeof Polygon;
    Rectangle: typeof Rectangle;
    Path: typeof Path;
    TileLayer: typeof TileLayer;
    GridLayer: typeof GridLayer;
    LayerGroup: typeof LayerGroup;
    FeatureGroup: typeof FeatureGroup;
    GeoJSON: typeof GeoJSON;
    Popup: typeof Popup;
    Tooltip: typeof Tooltip;
    LatLng: typeof LatLng;
    LatLngBounds: typeof LatLngBounds;
    Point: typeof Point;
    Bounds: typeof Bounds;
    Handler: typeof Handler;
  };

  export default L;
}
