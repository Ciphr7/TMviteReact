import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";
import { apiKey } from "./googleApiKey";
import "./GoogleMap.css";

const GoogleMapComponent = ({ tripResults }) => {
  const [map, setMap] = useState(null);
  const [polylinePoints, setPolylinePoints] = useState([]);
  const [startMarker, setStartMarker] = useState(null);
  const [endMarker, setEndMarker] = useState(null);
  const [polyline, setPolyline] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && tripResults && tripResults.MapPoints && tripResults.MapPoints.length > 0) {
      updateMap(tripResults);
    }
  }, [tripResults]);

  const updateMap = (tripResults) => {
    const points = tripResults.MapPoints.map((point) => new window.google.maps.LatLng(point.Lat, point.Lon));

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
    
    // Clear previous polyline and markers
    if (polyline) {
      polyline.setMap(null);
    }
    if (startMarker) {
      startMarker.setMap(null);
    }
    if (endMarker) {
      endMarker.setMap(null);
    }

    // Set start and end markers
    const newStartMarker = new window.google.maps.Marker({
      position: { lat: oLat, lng: oLon },
      map: mapRef.current,
      label: 'S' // Labeling it as 'S' for start
    });
    setStartMarker(newStartMarker);

    const newEndMarker = new window.google.maps.Marker({
      position: { lat: dLat, lng: dLon },
      map: mapRef.current,
      label: 'E' // Labeling it as 'E' for end
    });
    setEndMarker(newEndMarker);

    // Create new polyline
    const newPolyline = new window.google.maps.Polyline({
      path: newPolylinePoints,
      map: mapRef.current,
      strokeColor: "#ed1c24",
      strokeWeight: 3,
    });
    setPolyline(newPolyline);

    // Calculate center of polyline
    const bounds = new window.google.maps.LatLngBounds();
    newPolylinePoints.forEach((point) => bounds.extend(point));
    const center = bounds.getCenter();

    // Set map center to the calculated center
    mapRef.current.panTo(center);
  };

  const onLoad = (map) => {
    setMap(map);
    mapRef.current = map;
  };

  const mapStyles = {
    height: "100%",
    width: "100%",
  };

  return (
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
        >
          {polylinePoints.length > 0 && (
            <Polyline
              path={polylinePoints}
              options={{ strokeColor: "#ed1c24", strokeWeight: 3 }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default GoogleMapComponent;
