import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { CircularProgress, TextField } from "@mui/material";

const OriginAutocomplete = ({ value, onChange, isGPSChecked  }) => {
  const [autocompleteItems, setAutocompleteItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleAutocompleteChange = async (event, value) => {
    setInputValue(value);
    setLoading(true);
  
    try {
      const response = await fetch(
        `https://prime.promiles.com/WebAPI/api/ValidateLocation?locationText=${value}&apikey=bU03MSs2UjZIS21HMG5QSlIxUTB4QT090`
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      const items = data.map((item) => ({
        text: `${item.City}, ${item.State}, ${item.PostalCode}`,
        value: item,
      }));
  
      setAutocompleteItems(items);
    } catch (error) {
      console.error("Error fetching autocomplete data", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Autocomplete
  value={value}
  onChange={(event, newValue) => onChange(newValue)}
  inputValue={inputValue}
  onInputChange={handleAutocompleteChange}
  options={autocompleteItems}
  loading={loading}
  style={{ backgroundColor: "white", maxWidth: "300px", margin: "0 auto" }}
  getOptionLabel={(option) =>
    isGPSChecked && value && value.latitude && value.longitude && option.latitude && option.longitude
      ? `${option.latitude}, ${option.longitude}`
      : option.text || ""
  }
  renderInput={(params) => (
    <TextField
      {...params}
      label="Origin"
      color="primary"
      InputProps={{
        ...params.InputProps,
        endAdornment: (
          <React.Fragment>
            {loading ? (
              <CircularProgress color="inherit" size={20} />
            ) : null}
            {params.InputProps.endAdornment}
          </React.Fragment>
        ),
      }}
    />
  )}
/>
     
  );
};

export default OriginAutocomplete;
