import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";
import { apiKey } from "./googleApiKey";

const GoogleMapComponent = ({ tripResults }) => {
  const [map, setMap] = useState(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    console.log("Trip map results changed:", tripResults);  
    updateMap(tripResults);  
  }, [tripResults]); 

  const updateMap = (tripResults) => {
    console.log("Updating map with new trip results:", tripResults); 
    if (mapRef.current && tripResults && tripResults.MapPoints && tripResults.MapPoints.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      const points = tripResults.MapPoints.map((point) => new window.google.maps.LatLng(point.Lat, point.Lon));
      
      const oLat = tripResults.MapPoints[0].Lat;
      const oLon = tripResults.MapPoints[0].Lon;
      const dLat = tripResults.MapPoints[tripResults.MapPoints.length - 1].Lat;
      const dLon = tripResults.MapPoints[tripResults.MapPoints.length - 1].Lon;
      
      const newMarkers = [
        { position: { lat: oLat, lng: oLon }, title: tripResults.OriginLabel },
        { position: { lat: dLat, lng: dLon }, title: tripResults.DestinationLabel },
      ];
      
      markersRef.current = newMarkers;
      
      // Clear previous polyline
      if (polylineRef.current) {
        polylineRef.current.setMap('');
      }
      
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
      
      // Update map bounds
      mapRef.current.fitBounds(bounds);
    }
  };

  const onLoad = (map) => {
    setMap(map);
    mapRef.current = map;
  };

  const mapStyles = {
    height: "calc(var(--vh, 1vh) * 60)",
    width: "100%",
  };

  return (
    <div style={mapStyles}>
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
          {markersRef.current.map((marker, index) => (
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
