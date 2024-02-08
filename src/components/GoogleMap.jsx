import React, { useState } from "react";
import {apiKey} from "./googleApiKey"
import {
  GoogleMap,
  LoadScript,

} from "@react-google-maps/api";

const GoogleMapComponent = ({}) => {
  const [map, setMap] = useState(null);
  const onLoad = () => {
    setMap(map);
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
        ></GoogleMap>
      </LoadScript>
    </div>
  );
};
export default GoogleMapComponent;
