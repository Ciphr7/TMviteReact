import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapContainer = () => {
  const mapStyles = {
    height: '70vh',
    width: '100%',
  };

  const defaultCenter = {
    lat: 37.7749, // Default to San Francisco coordinates
    lng: -122.4194,
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyD0TSo9wlHN_Psu3chFZVYoSQS5rvz9Pog"> {/* Replace with your actual API key */}
      <GoogleMap mapContainerStyle={mapStyles} zoom={14} center={defaultCenter}>
        <Marker position={defaultCenter} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapContainer;
