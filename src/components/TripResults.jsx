import tmLogo from "../images/tmLogo.png";
import { useEffect, useRef } from "react";

const TripResults = ({ tripResults }) => {
  const mapRef = useRef(null);
  const markerOrgRef = useRef(null);
  const markerDestRef = useRef(null);
  const polylineRef = useRef(null);

  useEffect(() => {
    const mapOptions = {
      center: new window.google.maps.LatLng(
        tripResults.MapPoints[0].Lat,
        tripResults.MapPoints[0].Lon
      ),
      zoom: 10,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
    };

    const map = new window.google.maps.Map(mapRef.current, mapOptions);
    const bounds = new window.google.maps.LatLngBounds();

    const oLat = tripResults.MapPoints[0].Lat;
    const oLon = tripResults.MapPoints[0].Lon;
    const dLat = tripResults.MapPoints[tripResults.MapPoints.length - 1].Lat;
    const dLon = tripResults.MapPoints[tripResults.MapPoints.length - 1].Lon;

    if (markerOrgRef.current) {
      markerOrgRef.current.setMap(null);
    }
    if (markerDestRef.current) {
      markerDestRef.current.setMap(null);
    }

    markerOrgRef.current = new window.google.maps.Marker({
      position: new window.google.maps.LatLng(oLat, oLon),
      title: tripResults.OriginLabel,
      map,
    });
    bounds.extend(markerOrgRef.current.position);

    markerDestRef.current = new window.google.maps.Marker({
      position: new window.google.maps.LatLng(dLat, dLon),
      title: tripResults.DestinationLabel,
      map,
    });

    if (polylineRef.current && map) {
      polylineRef.current.setMap(null);
    }
    bounds.extend(markerDestRef.current.position);

    const points = tripResults.MapPoints.map(
      (point) => new window.google.maps.LatLng(point.Lat, point.Lon)
    );

    polylineRef.current = new window.google.maps.Polyline({
      path: points,
      editable: false,
      draggable: true,
      strokeColor: "#ed1c24",
      strokeWeight: 3,
      map,
    });

    map.fitBounds(bounds);
  }, [tripResults]);

  return (
    <>
    <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
      <div className="flex justify-center">
        <img className="h-20 pt-3 m-2" src={tmLogo} alt="" />
      </div>
      {tripResults ? (
        <div>
          <h2 className="flex justify-center">
            <strong>Trip Summary</strong>
          </h2>
          {/* Render the trip results using the received data */}
          <p>Origin: {tripResults.TripLegs[0].LocationText}</p>
          <p>Destination: {tripResults.TripLegs[1].LocationText}</p>
          <p>Trip Distance: {tripResults.TripDistance}</p>
          <p>Trip Time: {(tripResults.TripMinutes / 60).toFixed(2)} Hours</p>
          <h3 className="flex justify-center">
            <strong>Jurisdiction Mileage</strong>
          </h3>
          {tripResults.JurisdictionMileage ? (
            <ul>
              {tripResults.JurisdictionMileage.map((mileage) => (
                <li key={mileage.State}>
                  <p>
                    <strong>{mileage.State}:</strong> {mileage.TotalMiles} miles
                  </p>
                  <p>
                    Toll Miles: {mileage.TollMiles}, Non-Toll Miles:{" "}
                    {mileage.NonTollMiles}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No jurisdiction mileage data available yet.</p>
          )}
          <h1 className="flex justify-center">
            {" "}
            <strong>Driving Directions</strong>
          </h1>
          {tripResults.DrivingDirections ? (
            <ul>
              {tripResults.DrivingDirections.map((direction, index) => (
                <li key={index}>
                  <p>
                    <strong>Maneuver:</strong> {direction.Maneuver}
                  </p>
                  <p>
                    <strong>DistanceFrmStart:</strong>{" "}
                    {direction.DistanceAtStart}
                  </p>
                  <p>
                    <strong>LegMiles:</strong> {direction.LegMiles}
                  </p>
                  {/* Add more properties as needed */}
                </li>
              ))}
            </ul>
          ) : (
            <p>No driving directions available yet.</p>
          )}
        </div>
      ) : (
        <p>No trip results available yet.</p>
      )}
    </div>
     <div ref={mapRef} style={{ height: '400px', width: '100%' }} />;
     </>
  );
};

export default TripResults;
