import React, { useState, useEffect } from "react";
import tmLogo from "../images/tmLogo.png";

const TripResults = ({ tripResults }) => {

  return (
    <>
    <div style={{ maxHeight: "400px", overflowY: "scroll", scrollbarWidth: "none", msOverflowStyle: "none"}}>
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
    
     {/* <div ref={mapRef} style={{ height: '400px', width: '100%' }} />; */}
     </>
  );
};

export default TripResults;
