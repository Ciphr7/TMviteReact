import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";
import { apiKey } from "./googleApiKey";
import "./GoogleMap.css";

const GoogleMapComponent = ({ tripResults }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 39.8282, lng: -98.5795 });
  const [mapZoom, setMapZoom] = useState(4);
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
      label: tripResults.OriginLabel // Labeling it as 'S' for start
    });
    startMarkerRef.current = startMarker;

    const endMarker = new window.google.maps.Marker({
      position: { lat: dLat, lng: dLon },
      map: mapRef.current,
      label: tripResults.DestinationLabel // Labeling it as 'E' for end
    });
    endMarkerRef.current = endMarker;

    // Create new polyline
    const newPolyline = new window.google.maps.Polyline({
      path: newPolylinePoints,
      map: mapRef.current,
      strokeColor: "#ed1c24",
      strokeWeight: 3,
    });
    polylineRef.current = newPolyline;

    // Calculate bounds of the polyline
    const bounds = new window.google.maps.LatLngBounds();
    newPolylinePoints.forEach((point) => bounds.extend(point));

    // Fit the map to the bounds of the polyline only if the map is not centered manually
    if (!isMapCenteredManually()) {
      mapRef.current.fitBounds(bounds);
    }
  };

  const onLoad = (map) => {
    mapRef.current = map;
  };

  // Check if the map is centered manually
  const isMapCenteredManually = () => {
    // You can implement your own logic here to determine if the map is centered manually
    // For example, you could add a state variable to track manual centering
    return false; // Return true if the map is centered manually, otherwise return false
  };

  const mapStyles = {
    height: "100%",
    width: "100%",
  };

  const handlePanChanged = debounce(() => {
    if (!isMapCenteredManually() && mapRef.current) {
      setMapCenter(mapRef.current.getCenter().toJSON());
    }
  }, 300); // Adjust debounce delay as needed

  return (
    <div className="map-container">
      <LoadScript
        googleMapsApiKey={apiKey}
        loadingElement={<div>Loading...</div>}
        async
      >
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={mapZoom}
          center={mapCenter}
          onLoad={onLoad}
          onBoundsChanged={handlePanChanged}
          onDragEnd={handlePanChanged}
        >
          {tripResults && tripResults.MapPoints &&
            <Polyline
              path={tripResults.MapPoints.filter(point => typeof point.Lat === 'number' && typeof point.Lon === 'number').map(point => ({ lat: point.Lat, lng: point.Lon }))}
              options={{ strokeColor: "#ed1c24", strokeWeight: 3 }}
            />
          }
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default GoogleMapComponent;

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}
