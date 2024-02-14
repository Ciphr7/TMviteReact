import React, { useState, useEffect } from 'react';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const CorsExample = () => {
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [formattedResponseData, setFormattedResponseData] = useState([]);
  const headers = [
    { text: 'State', value: 'state' },
    { text: 'Average', value: 'average' },
    { text: 'IFTA Rate', value: 'refIFTA' },
    { text: 'Price Date', value: 'formattedDate' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const apiUrl = '/api/Averages/StateAverages'; // Use the proxy path

    const username = 'truckmiles';
    const authorizationToken = 'JLoRvcSi_MvlNHGCHSNPpp0xf2DFvcbjjaI-UhHhLRo7Bpeh7ftaSwGWWjU7cVdNL439d_mcgFoZNGVhn_Jd-Qh9OOtgW2ez29RcvrQK5xMya3oqsWXMlwhl0nOjCnXK0LvsrixGVKW0h20y_fmd8bDIF-1weMbb3hwtQ8Oqhjv1jf6CHs4dwSjVuLW0p8ND-H_nb6DaiHqZ-dWh7gfXatOEqXBN2_hmVum5wRXbsRg'; // Replace with your actual authorization token

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

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((data) => {
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
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const calculatePriceDates = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const formatDate = date => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    };

    return [formatDate(today), formatDate(yesterday)];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  return (
    <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell key={header.value}>{header.text}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {formattedResponseData.map((row, index) => (
                <TableRow key={index}>
                  {headers.map((header) => (
                    <TableCell key={header.value}>{row[header.value]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default CorsExample;
