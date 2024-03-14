import React, { useState, useEffect } from "react";
import tmLogo from "../images/tmLogo.png";

const TripResults = ({ tripResults }) => {

  return (
    <>
    <div style={{ maxHeight: "400px", overflowY: "scroll", scrollbarWidth: "none", msOverflowStyle: "none"}}>
    <style>
        {`
          @media print {
            body {
              font-size: 12px;
              line-height: 1.5;
              margin: 10px;
            }
            div.print-container {
              max-height: 400px;
              overflow-y: scroll;
              padding: 2px;
              margin: 2px;
              break-inside: avoid;
            }
          }
        `}
      </style>
   
      <div style={{ color: 'white' }}>
      {tripResults ? (
        <div className="print-container">
        
          {/* Render the trip results using the received data */}
          <p>Origin: {tripResults.TripLegs[0].LocationText}</p>
          <p>Destination: {tripResults.TripLegs[1].LocationText}</p>
          <p>Trip Distance: {tripResults.TripDistance}</p>
          <p>Trip Time: {(tripResults.TripMinutes / 60).toFixed(2)} Hours</p>
          <h3 className="flex justify-center">
            <strong>Jurisdiction Mileage</strong>
          </h3>
          {tripResults.JurisdictionMileage ? (
  <table>
    <thead>
      <tr>
        <th>State</th>
        <th>Total Miles</th>
        <th>Toll Miles</th>
        <th>Non-Toll Miles</th>
      </tr>
    </thead>
    <tbody>
      {tripResults.JurisdictionMileage.map((mileage, index) => (
        <tr key={index}>
          <td>{mileage.State}</td>
          <td>{mileage.TotalMiles} miles</td>
          <td>{mileage.TollMiles}</td>
          <td>{mileage.NonTollMiles}</td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p>No jurisdiction mileage data available yet.</p>
)}

          <h1 className="flex justify-center">
            {" "}
            <strong>Driving Directions</strong>
          </h1>
          {tripResults.DrivingDirections ? (
         <table>
         <thead>
           <tr>
             <th></th>
             <th>For</th>
             <th>At</th>
             {/* Add more headings for additional properties if needed */}
           </tr>
         </thead>
         <tbody>
           {tripResults.DrivingDirections.map((direction, index) => (
             <tr key={index}>
               <td>{direction.Maneuver}</td>
               <td>{direction.DistanceAtStart}</td>
               <td>{direction.LegMiles}</td>
               {/* Add more cells for additional properties if needed */}
             </tr>
           ))}
         </tbody>
       </table>
          ) : (
            <p>No driving directions available yet.</p>
          )}
        </div>
      ) : (
        <p>No trip results available yet.</p>
      )}
    </div>
    </div>
     {/* <div ref={mapRef} style={{ height: '400px', width: '100%' }} />; */}
     </>
  );
};

export default TripResults;
