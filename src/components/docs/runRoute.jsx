import React, { useState } from 'react';
import axios from 'axios';

const API_ENDPOINT = 'https://prime.promiles.com/WebAPI/Scripts/PRIME/PRIMEWebAPI.ashx?apikey=Nm1FY1FtQ2ZMeWoySU5oeElyMnY2Zz090';

function RunRoute() {
  const [location1, setLocation1] = useState('');
  const [location2, setLocation2] = useState('');
  const [distance, setDistance] = useState(null);

  const calculateDistance = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINT}&loc1=${location1}&loc2=${location2}`);
      setDistance(response.data.distance);
    } catch (error) {
      console.error('Error fetching distance:', error);
    }
  };

  return (
    <div>
      <h1>Distance Calculator</h1>
      <label>
        Location 1:
        <input type="text" value={location1} onChange={(e) => setLocation1(e.target.value)} />
      </label>
      <br />
      <label>
        Location 2:
        <input type="text" value={location2} onChange={(e) => setLocation2(e.target.value)} />
      </label>
      <br />
      <button className="text-3 text-white p-2 text-center font-bold bg-red-600" onClick={calculateDistance}>Calculate Distance</button>
      <br />
      {distance !== null && <p>Distance: {distance} miles</p>}
    </div>
  );
}

export default RunRoute;
