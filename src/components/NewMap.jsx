import React, { useEffect, useRef, useState } from "react";
import GoogleMapReact from 'google-map-react';
import { apiKey } from "./googleApiKey";
import "./GoogleMap.css";

const GoogleMapComponent = ({ tripResults }) => {
  const [map, setMap] = useState(null);
  const [polylinePoints, setPolylinePoints] = useState([]);
  const [startMarker, setStartMarker] = useState(null);
  const [endMarker, setEndMarker] = useState(null);
  const mapRef = useRef(null);
  const polylineRef = useRef(null);

  useEffect(() => {
    if (tripResults && tripResults.MapPoints && tripResults.MapPoints.length > 0) {
      updateMap(tripResults);
    }
  }, [tripResults]);

  const updateMap = (tripResults) => {
    const points = tripResults.MapPoints.map((point) => ({
      lat: point.Lat,
      lng: point.Lon
    }));
  
    const oLat = tripResults.MapPoints[0].Lat;
    const oLon = tripResults.MapPoints[0].Lon;
    const dLat = tripResults.MapPoints[tripResults.MapPoints.length - 1].Lat;
    const dLon = tripResults.MapPoints[tripResults.MapPoints.length - 1].Lon;
  
    const newPolylinePoints = [
      { lat: oLat, lng: oLon },
      ...points,
      { lat: dLat, lng: dLon }
    ];
  
    setPolylinePoints(newPolylinePoints);
    
    // Clear previous markers and polyline
    setStartMarker({ lat: oLat, lng: oLon });
    setEndMarker({ lat: dLat, lng: dLon });

    // Draw polyline
    drawPolyline(newPolylinePoints);
  };
  
  const drawPolyline = (points) => {
    // Clear previous polyline
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    // Draw new polyline
    const polyline = new window.google.maps.Polyline({
      path: points,
      geodesic: true,
      strokeColor: "#ed1c24",
      strokeOpacity: 1.0,
      strokeWeight: 3
    });
    polyline.setMap(mapRef.current);
    polylineRef.current = polyline;

    // Calculate bounds of the polyline
    const bounds = new window.google.maps.LatLngBounds();
    points.forEach((point) => bounds.extend(point));

    // Fit the map to the bounds of the polyline
    mapRef.current.fitBounds(bounds);
  };

  return (
    <div className="map-container">
      <GoogleMapReact
        bootstrapURLKeys={{ key: apiKey }}
        defaultCenter={{ lat: 39.8282, lng: -98.5795 }}
        defaultZoom={4}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => {
          setMap(map);
          mapRef.current = map;
        }}
      >
        {startMarker && (
          <Marker
            key="start"
            lat={startMarker.lat}
            lng={startMarker.lng}
            text="S"
          />
        )}
        {endMarker && (
          <Marker
            key="end"
            lat={endMarker.lat}
            lng={endMarker.lng}
            text="E"
          />
        )}
      </GoogleMapReact>
    </div>
  );
};

const Marker = ({ text }) => (
  <div style={{ color: 'white', background: 'blue', padding: '5px 10px', display: 'inline-flex', textAlign: 'center', alignItems: 'center', justifyContent: 'center', borderRadius: '100%', transform: 'translate(-50%, -50%)' }}>
    {text}
  </div>
);

export default GoogleMapComponent;
