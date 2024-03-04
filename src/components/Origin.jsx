import React, { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Container,
  Switch,
  FormControlLabel,
  Grid,
  CircularProgress,
  TextField,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const Origin = (props) => {
  const [gpsCheck, setGpsCheck] = useState(false);
  const [autocompleteItems, setAutocompleteItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const handleSwitchChange = () => {
    setGpsCheck(!gpsCheck);
  };

  useEffect(() => {
    setSearchInput("");
  }, [gpsCheck]);

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

  const setOriginToCurrentLocation = () => {
    if (navigator.geolocation) {
      var options = {
        maximumAge: 0,
        timeout: 30000,
        enableHighAccuracy: true,
      };
      navigator.geolocation.getCurrentPosition(
        (position) => {
          var lat = position.coords.latitude;
          var lon = position.coords.longitude;

          props.handleLatChange(lat);
          props.handleLonChange(lon);

          if (!gpsCheck) {
            setGpsCheck(true);
          }
        },
        (error) => {
          console.warn(`ERROR(${error.code}): ${error.message}`);
        },
        [options]
      );
    } else {
      alert("User did not allow access to GPS location");
    }
  };

  const theme = createTheme({
    components: {
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            color: "orange",
          },
          colorPrimary: {
            "&.Mui-checked": {
              color: "red",
            },
          },
          track: {
            opacity: 0.2,
            backgroundColor: "white",
            ".Mui-checked.Mui-checked + &": {
              opacity: 0.9,
              backgroundColor: "black",
            },
          },
        },
      },
    },
  });

  return (
    <div>
      <Container>
        <section>
          <Grid container alignItems="center">
            <Grid item>
              <ThemeProvider theme={theme}>
                <FormControlLabel
                  control={
                    <Switch
                      id="SetToCurrentLocation"
                      checked={gpsCheck}
                      onChange={() => {
                        handleSwitchChange();
                        if (!gpsCheck) {
                          setOriginToCurrentLocation();
                        }
                      }}
                      sx={{
                        "& .MuiSwitch-thumb": {
                          bgcolor: gpsCheck ? "red" : "white",
                        },
                      }}
                    />
                  }
                  label={`Set Origin to My GPS Location`}
                />
              </ThemeProvider>
            </Grid>
            <Grid item>
              <div
                className={gpsCheck ? "theme--dark" : ""}
                style={{ color: gpsCheck ? "red" : "white" }}
              >
                <MyLocationIcon />
              </div>
            </Grid>
          </Grid>
        </section>
      </Container>

      {!gpsCheck ? (
        <Autocomplete
          value={props.selectedItem}
          onChange={(event, newValue) => props.updateSelectedItem(newValue)}
          inputValue={searchInput}
          onInputChange={handleAutocompleteChange}
          style={{ backgroundColor: "white", maxWidth: "300px", margin: "0 auto" }}
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
      ) : (
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <div>
            Using your location as Origin:<br /> {props.lat}, {props.lon}
          </div>
        </div>
      )}
    </div>
  );
};

export default Origin;
