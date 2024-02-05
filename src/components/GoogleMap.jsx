import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";


const GoogleMapComponent = ({ tripResults }) => {
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);

  useEffect(() => {
    console.log("Trip map results changed:", tripResults);  // Log when tripResults changes
    updateMap(tripResults);  // Call updateMap when tripResults changes
  }, [tripResults]);

  const onLoad = (map) => {
    setMap(map);
    mapRef.current = map;
  };

  const updateMap = (newTripResults) => {
    console.log("Updating map with new trip results:", newTripResults); 
    if (mapRef.current && newTripResults && newTripResults.MapPoints && newTripResults.MapPoints.length > 0) {
      // Clear previous markers and polyline
      markersRef.current.forEach((marker) => marker.setMap(null));
      polylineRef.current && polylineRef.current.setMap(null);

      const bounds = new window.google.maps.LatLngBounds();
      const points = newTripResults.MapPoints.map((point) => new window.google.maps.LatLng(point.Lat, point.Lon));

      const oLat = newTripResults.MapPoints[0].Lat;
      const oLon = newTripResults.MapPoints[0].Lon;
      const dLat = newTripResults.MapPoints[newTripResults.MapPoints.length - 1].Lat;
      const dLon = newTripResults.MapPoints[newTripResults.MapPoints.length - 1].Lon;

      const newMarkers = [
        { position: { lat: oLat, lng: oLon }, title: newTripResults.OriginLabel },
        { position: { lat: dLat, lng: dLon }, title: newTripResults.DestinationLabel },
      ];

      markersRef.current = newMarkers;

      const newPolyline = new window.google.maps.Polyline({
        path: points,
        editable: false,
        strokeColor: "#ed1c24",
        strokeWeight: 3,
      });

      polylineRef.current = newPolyline;

      newMarkers.forEach((marker) => {
        const newMarker = new window.google.maps.Marker({
          position: marker.position,
          title: marker.title,
          map: mapRef.current,
        });
        bounds.extend(newMarker.getPosition());
      });

      newPolyline.setMap(mapRef.current);

      // Fit the map to the bounds
      mapRef.current.fitBounds(bounds);
    }
  };

  const mapStyles = {
    height: "calc(var(--vh, 1vh) * 60)",
    width: "100%",
  };

  return (
    <div style={mapStyles}>
      <LoadScript googleMapsApiKey="AIzaSyD0TSo9wlHN_Psu3chFZVYoSQS5rvz9Pog">
        <GoogleMap mapContainerStyle={mapStyles} zoom={4} center={{ lat: 39.8282, lng: -98.5795 }} onLoad={onLoad}>
          {markersRef.current.map((marker, index) => (
            <Marker key={index} position={marker.position} title={marker.title} />
          ))}
          {polylineRef.current && (
            <Polyline path={polylineRef.current.getPath().getArray()} options={{ strokeColor: "#ed1c24", strokeWeight: 3 }} />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default GoogleMapComponent;
