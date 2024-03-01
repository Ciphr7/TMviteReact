import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Container,
  Switch,
  FormControlLabel,
  Grid,
  Icon,
  CircularProgress,
  TextField,
} from "@mui/material";

const Destination = (props) => {
  const [gpsCheck, setGpsCheck] = useState(false);
  const [autocompleteItems, setAutocompleteItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const handleAutocompleteChange = async (event, value) => {
    setSearchInput(value);
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
      value={props.selectedItem2}
      onChange={(event, newValue) => props.updateSelectedItem(newValue)}
      inputValue={searchInput}
      onInputChange={handleAutocompleteChange}
      options={autocompleteItems}
      loading={loading}
      getOptionLabel={(option) => option.text}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label}
          color={props.baseColor}
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

export default Destination;
