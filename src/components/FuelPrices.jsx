import React, { useState, useEffect } from 'react';

const FuelPrices = () => {
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [formattedResponseData, setFormattedResponseData] = useState([]);
  const [authorizationToken, setAuthorizationToken] = useState('');
  const [lastDataFetchTimestamp, setLastDataFetchTimestamp] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('authorizationToken');
    const tokenTimestamp = localStorage.getItem('tokenTimestamp');
    const data = localStorage.getItem('responseData');
    const formattedData = localStorage.getItem('formattedResponseData');

    if (token && tokenTimestamp) {
      setAuthorizationToken(token);
      if (data && formattedData) {
        const currentTime = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        if (currentTime - parseInt(tokenTimestamp) < oneDay) {
          setResponseData(JSON.parse(data));
          setFormattedResponseData(JSON.parse(formattedData));
          setLoading(false);
          return;
        }
      }
    }

    fetchTokenAndData();
    const tokenInterval = setInterval(fetchTokenAndData, 3600000);
    return () => clearInterval(tokenInterval);
  }, []);

  const handleFetchData = () => {
    setLoading(true);
    fetchTokenAndData();
  };

  const fetchTokenAndData = async () => {
    try {
      console.log("Fetching token...");
      const tokenResponse = await fetchToken();
      if (tokenResponse.ok) {
        console.log("Token fetched successfully");
        const tokenData = await tokenResponse.json();
        const token = tokenData.access_token;
        setAuthorizationToken(token);
        localStorage.setItem('authorizationToken', token);
        localStorage.setItem('tokenTimestamp', Date.now());
        fetchData();
      } else {
        throw new Error("Failed to fetch token");
      }
    } catch (error) {
      console.error("Error fetching token:", error);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    const apiUrl = 'https://axis.promiles.com/v1/Averages/StateAverages';
    const username = 'truckmiles';

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authorizationToken}`,
        username: username,
      },
      body: JSON.stringify({
        states: [
          "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
          "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA",
          "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY",
          "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX",
          "UT", "VT", "VA", "WA", "WV", "WI", "WY"
        ],
        priceDates: calculatePriceDates(),
        fuelTypes: ["DIESEL"],
      }),
    };

    try {
      console.log("Fetching data from API...");
      const response = await fetch(apiUrl, requestOptions);
      if (response.ok) {
        console.log("Data fetched successfully");
        const data = await response.json();
        setResponseData(data.map((item) => ({
          state: item.state,
          average: item.average,
          priceDate: item.priceDate,
          refIFTA: item.refIFTA
        })));
        setFormattedResponseData(data.map(item => ({
          ...item,
          formattedDate: formatDate(new Date(item.priceDate)),
        })));
        setLastDataFetchTimestamp(Date.now());

        // Store data in localStorage
        localStorage.setItem('responseData', JSON.stringify(data));
        localStorage.setItem('formattedResponseData', JSON.stringify(data.map(item => ({
          ...item,
          formattedDate: formatDate(new Date(item.priceDate)),
        }))));
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchToken = async () => {
    const apiUrl = 'https://axis.promiles.com/v1/Token';

    try {
      console.log("Fetching token from API...");
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'password',
          username: 'truckmiles',
          password: '#Qp7D4jqCAW2Um2t',
        }),
      });
      return response;
    } catch (error) {
      console.error("Error fetching token:", error);
      throw error;
    }
  };

  const calculatePriceDates = () => {
    // Implement calculatePriceDates function logic here
  };

  const formatDate = (date) => {
    const options = { month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
      <button onClick={handleFetchData} disabled={loading}>
        {loading ? 'Fetching...' : 'Force Fetch Data'}
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead style={{ position: "sticky", top: 0, zIndex: 1, background: "#f44336" }}>
            <tr>
              <th className='px-2'>State</th>
              <th className='px-2'>Average</th>
              <th className='px-2'>Price Date</th>
              <th className='px-2'>Ref IFTA</th>
            </tr>
          </thead>
          <tbody>
            {formattedResponseData.map((item, index) => (
              <tr key={index}>
                <td>{item.state}</td>
                <td>{item.average}</td>
                <td>{formatDate(new Date(item.priceDate))}</td>
                <td>{item.refIFTA}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FuelPrices;
