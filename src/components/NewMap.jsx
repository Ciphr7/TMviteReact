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

  const MyComp = ({ text }) => (
    <div style={{ color: 'white', background: 'blue', padding: '5px 10px', display: 'inline-flex', textAlign: 'center', alignItems: 'center', justifyContent: 'center', borderRadius: '100%', transform: 'translate(-50%, -50%)' }} >
      {text}
    </div>
  );

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
    setStartMarker({ lat: oLat, lng: oLon });
    setEndMarker({ lat: dLat, lng: dLon });

    drawPolyline(newPolylinePoints);
  };
  
  const drawPolyline = (points) => {
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    const polyline = new window.google.maps.Polyline({
      path: points,
      geodesic: true,
      strokeColor: "#ed1c24",
      strokeOpacity: 1.0,
      strokeWeight: 3
    });
    polyline.setMap(mapRef.current);
    polylineRef.current = polyline;

    const bounds = new window.google.maps.LatLngBounds();
    points.forEach((point) => bounds.extend(point));
    mapRef.current.fitBounds(bounds);
  };

  useEffect(() => {
    console.log("startMarker:", startMarker);
    console.log("endMarker:", endMarker);
  }, [startMarker, endMarker]);

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
        <MyComp
          key="start"
          lat={startMarker ? startMarker.lat : 0}
          lng={startMarker ? startMarker.lng : 0}
          text='start'
        />
        <MyComp
          key="end"
          lat={endMarker ? endMarker.lat : 0}
          lng={endMarker ? endMarker.lng : 0}
          text="end"
        />
      </GoogleMapReact>
    </div>
  );
};

export default GoogleMapComponent;
