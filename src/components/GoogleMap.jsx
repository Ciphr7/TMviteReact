import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapContainer = () => {
  const mapStyles = {
    height: 'calc(var(--vh, 1vh) * 100)',
    width: '100%',
  };

  const defaultCenter = {
    lat: 39.8282, // Default to San Francisco coordinates
    lng: -98.5795,
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyD0TSo9wlHN_Psu3chFZVYoSQS5rvz9Pog"> {/* Replace with your actual API key */}
      <GoogleMap mapContainerStyle={mapStyles} zoom={4} center={defaultCenter}>
        <Marker position={defaultCenter} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapContainer;
