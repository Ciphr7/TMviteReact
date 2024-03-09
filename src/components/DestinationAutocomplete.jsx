import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { CircularProgress, TextField } from "@mui/material";

const DestinationAutocomplete = ({ value, onChange }) => {
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
      className="searchBox text-black px-1 my-2 w-60 mx-auto rounded-sm"
      onChange={(event, newValue) => onChange(newValue)}
      inputValue={inputValue}
      onInputChange={handleAutocompleteChange}
      options={autocompleteItems}
      loading={loading}
      style={{ backgroundColor: "white", maxWidth: "300px", margin: "0 auto" }}
      getOptionLabel={(option) => option.text}
      renderInput={(params) => (
        <TextField
        {...params}
        placeholder="e.g. 77611"
        variant="standard"
        label="Destination"
        InputProps={{
            ...params.InputProps,
            endAdornment: (
                <>
                    {loading ? (
                        <CircularProgress color="primary" size={10} />
                    ) : null}
                    {params.InputProps.endAdornment}
                </>
            ),
        }}
        InputLabelProps={{
            style: { color: 'primary' }, // Change label color here
        }}
    />
      )}
    />
  );
};

export default DestinationAutocomplete;
