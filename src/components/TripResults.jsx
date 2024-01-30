import tmLogo from "../images/tmLogo.png";

const TripResults = ({ tripResults }) => {
  return (
    <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
      <div className="flex justify-center">
        <img className="h-20 pt-3 m-2" src={tmLogo} alt="" />
      </div>
      {tripResults ? (
        <div>
          <h2>Trip Results</h2>
          {/* Render the trip results using the received data */}
          <p>Origin: {tripResults.TripLegs[0].LocationText}</p>
          <p>Destination: {tripResults.TripLegs[1].LocationText}</p>
          <p>Trip Distance: {tripResults.TripDistance}</p>
          <p>Trip Time: {(tripResults.TripMinutes / 60).toFixed(2)} Hours</p>
          <h3>Jurisdiction Mileage</h3>
          {tripResults.JurisdictionMileage ? (
            <ul>
              {tripResults.JurisdictionMileage.map((mileage) => (
                <li key={mileage.State}>
                  <p>
                    <strong>{mileage.State}:</strong> {mileage.TotalMiles} miles
                  </p>
                  <p>
                    Toll Miles: {mileage.TollMiles}, Non-Toll Miles: {mileage.NonTollMiles}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No jurisdiction mileage data available yet.</p>
          )}
        </div>
      ) : (
        <p>No trip results available yet.</p>
      )}
    </div>
  );
};

export default TripResults;
