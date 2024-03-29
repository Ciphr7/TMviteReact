import React, { useEffect, useRef, useMemo } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { apiKey } from "./googleApiKey";
import "./GoogleMap.css";

const GoogleMapComponent = ({ tripResults }) => {
  const mapRef = useRef(null);
  const polylineRef = useRef(null);
  const startMarkerRef = useRef(null);
  const endMarkerRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && tripResults && tripResults.MapPoints && tripResults.MapPoints.length > 0) {
      updateMap(tripResults);
    }
  }, [tripResults]);

  const updateMap = (tripResults) => {
    const mapPoints = tripResults && tripResults.MapPoints ? tripResults.MapPoints : [];

    // Validate and filter out invalid coordinates
    const validPoints = mapPoints.filter(point => typeof point.Lat === 'number' && typeof point.Lon === 'number');

    if (validPoints.length === 0) {
      console.error("No valid coordinates found.");
      return;
    }

    const points = validPoints.map((point) => new window.google.maps.LatLng(point.Lat, point.Lon));

    const oLat = validPoints[0].Lat;
    const oLon = validPoints[0].Lon;
    const dLat = validPoints[validPoints.length - 1].Lat;
    const dLon = validPoints[validPoints.length - 1].Lon;

    const newPolylinePoints = [
      { lat: oLat, lng: oLon },
      ...points,
      { lat: dLat, lng: dLon }
    ];

    // Clear previous polyline and markers
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }
    if (startMarkerRef.current) {
      startMarkerRef.current.setMap(null);
    }
    if (endMarkerRef.current) {
      endMarkerRef.current.setMap(null);
    }

    // Set start and end markers
    const startMarker = new window.google.maps.Marker({
      position: { lat: oLat, lng: oLon },
      map: mapRef.current,
      label:{
        text: tripResults.OriginLabel, // Text content of the label
        color: 'black', // Text color
        fontWeight: 'bold', // Text weight
        strokeColor: 'white', // Stroke color
        strokeWeight: 2 // Stroke weight
      },
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' // Blue marker
      }
    });
    startMarkerRef.current = startMarker;

    const endMarker = new window.google.maps.Marker({
      position: { lat: dLat, lng: dLon },
      map: mapRef.current,
      label:{
        text: tripResults.DestinationLabel,
        color: 'black', // Text color
        fontWeight: 'bold', // Text weight
        strokeColor: 'white', // Stroke color
        strokeWeight: 2 // Stroke weight
      },
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' // Blue marker
      }
    });
    endMarkerRef.current = endMarker;

    // Create new polyline
    const newPolyline = new window.google.maps.Polyline({
      path: newPolylinePoints,
      map: mapRef.current,
      strokeColor: "#0082CB",
      strokeWeight: 3,
    });
    polylineRef.current = newPolyline;

    // Calculate bounds of the polyline
    const bounds = new window.google.maps.LatLngBounds();
    newPolylinePoints.forEach((point) => bounds.extend(point));

    // Fit the map to the bounds of the polyline only if there's no polyline already present
    if (!tripResults.Polyline) {
      mapRef.current.fitBounds(bounds);
    }
  };

  const onLoad = (map) => {
    mapRef.current = map;
  };

  const mapStyles = {
    height: "100%",
    width: "100%",
  };

  return useMemo(() => (
    <div className="map-container">
      <LoadScript
        googleMapsApiKey={apiKey}
        loadingElement={<div>Loading...</div>}
        async
      >
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={4}
          center={{ lat: 39.8282, lng: -98.5795 }}
          onLoad={onLoad}
          options={{
            gestureHandling: "greedy" // Enable zooming without holding control key
          }}
        />
      </LoadScript>
    </div>
  ), []);

};

export default React.memo(GoogleMapComponent);
