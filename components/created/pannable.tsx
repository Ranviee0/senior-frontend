import { CircleMarker, Popup, useMap } from "react-leaflet";
import type { LatLngExpression, Map as LeafletMap } from "leaflet";

export const PannableCircleMarker = ({
  position,
  popupContent,
  radius = 8,
  fillColor = "#3388ff",
}: {
  position: LatLngExpression;
  popupContent: React.ReactNode;
  radius?: number;
  fillColor?: string;
}) => {
  const map = useMap();

  const handleClick = () => {
    (map as L.Map).flyTo(position, map.getZoom(), { animate: true });
  };

  return (
    <CircleMarker
      center={position}
      radius={radius}
      pathOptions={{
        fillColor,
        fillOpacity: 0.9,
        color: "#fff",
        weight: 2,
      }}
      eventHandlers={{
        click: handleClick,
      }}
    >
      <Popup>{popupContent}</Popup>
    </CircleMarker>
  );
};
