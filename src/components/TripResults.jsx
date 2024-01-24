const TripResults = ({ tripResults }) => {
  return (
    <div>
      {tripResults ? (
        <div>
          <h2>Trip Results</h2>
          {/* Render the trip results using the received data */}
          <p>Origin: {tripResults.TripLegs[0].LocationText}</p>
          <p>Destination: {tripResults.TripLegs[1].LocationText}</p>
          <p>Trip Distance: {tripResults.TripDistance}</p>
          {/* Add more details as needed */}
        </div>
      ) : (
        <p>No trip results available yet.</p>
      )}
    </div>
  );
};

export default TripResults;
