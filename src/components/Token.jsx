import React, { useState } from 'react';
import Button from "@mui/material/Button";
const MyToken = () => {
  const [token, setToken] = useState(null);

  const fetchToken = async () => {
    try {
      const response = await fetch("/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "password",
          username: "truckmiles",
          password: "#Qp7D4jqCAW2Um2t",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.access_token);
      } else {
        console.error("Failed to fetch token");
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  return (
    <div>
      <h1>Token</h1>
      <Button onClick={fetchToken}>Fetch Token</Button>
      {token && <div>Token: {token}</div>}
    </div>
  );
};

export default MyToken;
