import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";
import { apiKey } from "./googleApiKey";

const GoogleMapComponent = ({ tripResults }) => {
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const polylineRef = useRef(null);

  useEffect(() => {
    // Clear previous markers and polyline if they exist
    if (markers.length > 0) {
      markers.forEach(marker => marker.setMap(null)); // Remove markers from the map
      setMarkers([]); // Clear markers state
    }
    if (polylineRef.current) {
      polylineRef.current.setMap(null); // Remove polyline from the map
    }

    if (mapRef.current && tripResults && tripResults.MapPoints && tripResults.MapPoints.length > 0) {
      const points = tripResults.MapPoints.map(point => ({ lat: point.Lat, lng: point.Lon }));

      // Create markers for origin and destination
      const origin = tripResults.MapPoints[0];
      const destination = tripResults.MapPoints[tripResults.MapPoints.length - 1];
      const newMarkers = [
        new window.google.maps.Marker({ position: { lat: origin.Lat, lng: origin.Lon }, title: tripResults.OriginLabel }),
        new window.google.maps.Marker({ position: { lat: destination.Lat, lng: destination.Lon }, title: tripResults.DestinationLabel }),
      ];
      setMarkers(newMarkers);

      // Set the map for markers
      newMarkers.forEach(marker => {
        marker.setMap(mapRef.current);
      });

      // Create a new polyline
      const newPolyline = new window.google.maps.Polyline({
        path: points,
        editable: false,
        strokeColor: "#ed1c24",
        strokeWeight: 3,
      });
      polylineRef.current = newPolyline;

      // Set the map for polyline
      newPolyline.setMap(mapRef.current);

      // Calculate bounds manually based on polyline's path
      const bounds = new window.google.maps.LatLngBounds();
      points.forEach(point => bounds.extend(point));
      
      // Zoom map to fit the bounds
      mapRef.current.fitBounds(bounds);
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
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default GoogleMapComponent;
