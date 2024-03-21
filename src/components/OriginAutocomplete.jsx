import React, { useState, useEffect } from "react";
import { CircularProgress, TextField, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useTheme } from "@mui/material/styles";
import { lookUpKey} from "./tmAPIKey";

const OriginAutocomplete = ({
  onOriginSelected,
  latitude,
  longitude,
  value,
  onChange,
  isGPSChecked,
}) => {
  const [autocompleteItems, setAutocompleteItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const theme = useTheme();

  useEffect(() => {
    const handleAutocompleteChange = async (value) => {
      setInputValue(value);
      setLoading(true);

      try {
        const response = await fetch(
          `https://prime.promiles.com/WebAPI/api/ValidateLocation?locationText=${value}&${lookUpKey}`
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

        // Scroll the screen up by 100 pixels to show new autocompleteItems
        window.scrollBy(0, -100);
      } catch (error) {
        console.error("Error fetching autocomplete data", error);
      } finally {
        setLoading(false);
      }
    };

    const inputElement = document.getElementById("origin-input");
    if (inputElement) {
      const handleInput = (event) => {
        const value = event.target.value;
        handleAutocompleteChange(value);
      };
      inputElement.addEventListener("input", handleInput);

      return () => {
        inputElement.removeEventListener("input", handleInput);
      };
    }
  }, []); // Dependency array is empty since this effect should run once

  useEffect(() => {
    if (!isGPSChecked) {
      // If GPS is unchecked, clear the input value
      setInputValue("");
    } else {
      // If GPS is checked, use the provided latitude and longitude
      const locationText = `${latitude},${longitude}`;
      setInputValue(locationText);
    }
  }, [isGPSChecked, latitude, longitude]);

  const handleSelect = (event, selectedItem) => {
    setInputValue(selectedItem.text);
    setAutocompleteItems([]); // Reset autocompleteItems to empty array
    onOriginSelected(selectedItem.value); // Pass selected origin to parent component
  };

  const handleClear = () => {
    setInputValue("");
  };

  return (
    <div className="searchBox text-white px-1 my-2 w-60 mx-auto rounded-sm">
      <TextField
        id="origin-input"
        placeholder={inputValue ? "" : "e.g. houston, tx"}
        variant="standard"
        label={inputValue ? "Origin" : ""}
        value={inputValue}
        onChange={(event) => {
          // Only update inputValue if GPS is not checked
          if (!isGPSChecked) {
            setInputValue(event.target.value);
          }
        }}
        InputProps={{
          style: { backgroundColor: "white" }, // Set background color to white
          endAdornment: (
            <>
              {loading ? <CircularProgress color="primary" size={20} /> : null}
              {inputValue && (
                <IconButton onClick={handleClear} size="small">
                  <ClearIcon />
                </IconButton>
              )}
            </>
          ),
        }}
        InputLabelProps={{
          style: { color: theme.palette.primary.main }, // Change label color here
        }}
      />
      <ul className="bg-danger">
        {autocompleteItems.map((item, index) => (
          <li key={index} onClick={(event) => handleSelect(event, item)}>
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OriginAutocomplete;
