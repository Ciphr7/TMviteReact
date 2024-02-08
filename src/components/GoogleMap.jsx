import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";
import { apiKey } from "./googleApiKey";

const GoogleMapComponent = ({ tripResults }) => {
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const polylineRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && tripResults && tripResults.MapPoints && tripResults.MapPoints.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      const points = tripResults.MapPoints.map(point => new window.google.maps.LatLng(point.Lat, point.Lon));

      // Create markers for origin and destination
      const origin = tripResults.MapPoints[0];
      const destination = tripResults.MapPoints[tripResults.MapPoints.length - 1];
      const newMarkers = [
        { position: { lat: origin.Lat, lng: origin.Lon }, title: tripResults.OriginLabel },
        { position: { lat: destination.Lat, lng: destination.Lon }, title: tripResults.DestinationLabel },
      ];
      setMarkers(newMarkers);

      // Create a new polyline
      const newPolyline = new window.google.maps.Polyline({
        path: points,
        editable: false,
        strokeColor: "#ed1c24",
        strokeWeight: 3,
      });
      polylineRef.current = newPolyline;

      // Extend bounds with polyline points
      points.forEach(point => bounds.extend(point));

      // Set the center and zoom directly on the map instance
      mapRef.current.fitBounds(bounds);

      // Set the map for markers
      newMarkers.forEach(marker => {
        new window.google.maps.Marker({
          position: marker.position,
          title: marker.title,
          map: mapRef.current,
        });
      });

      // Set the map for polyline
      newPolyline.setMap(mapRef.current);
    }
  }, [tripResults]);

  const mapStyles = {
    height: "calc(var(--vh, 1vh) * 60)",
    width: "100%",
  };

  const onLoad = map => {
    setMap(map);
    mapRef.current = map;
  };

  return (
    <div style={mapStyles}>
      <LoadScript
        googleMapsApiKey={apiKey}
        onLoad={() => console.log("Google Maps API loaded successfully")} // Add onLoad callback for debugging
      >
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={4}
          center={{ lat: 39.8282, lng: -98.5795 }}
          onLoad={onLoad}
        >
          {markers.map((marker, index) => (
            <Marker key={index} position={marker.position} title={marker.title} />
          ))}
          {polylineRef.current && (
            <Polyline
              path={polylineRef.current.getPath().getArray()}
              options={{ strokeColor: "#ed1c24", strokeWeight: 3 }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default GoogleMapComponent;
