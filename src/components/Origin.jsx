import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { Container, Switch, FormControlLabel, Grid, Icon, CircularProgress, TextField } from '@mui/material';

const Origin = (props) => {
  const [gpsCheck, setGpsCheck] = useState(false);
  const [autocompleteItems, setAutocompleteItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const handleSwitchChange = () => {
    setGpsCheck(!gpsCheck);
    setSearchInput('');
  };

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

          // Call the lat and lon handler functions passed from parent
          props.handleLatChange(lat);
          props.handleLonChange(lon);
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

  return (
    <div>
      <Container>
        <section>
          <Grid container alignItems="center">
            <Grid item>
              <FormControlLabel
                control={
                  <Switch
                    id="SetToCurrentLocation"
                    className="py-1"
                    color="primary"
                    checked={gpsCheck}
                    onChange={setOriginToCurrentLocation}
                  />
                }
                label={`Set Origin to My GPS Location`}
              />
            </Grid>
            <Grid item>
              <Icon className={gpsCheck ? 'theme--dark' : ''} style={{ color: gpsCheck ? 'red' : 'white' }}>
                mdi
              </Icon>
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
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
      ) : (
        <div>
          <div>
            Using your location as Origin: {props.lat}, {props.lon}
          </div>
          {/* Use this info as needed */}
        </div>
      )}
    </div>
  );
};

export default Origin;
