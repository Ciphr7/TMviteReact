import React, { useState, useEffect, useRef  } from "react";
import tmLogo from "../images/tmLogo.png";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { lookUpKey, tmAPIKey } from "./tmAPIKey";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import "./LocationLookup.css";
import MySelect from "./RouteOptions";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { CircularProgress } from "@mui/material";
import TextField from "@mui/material/TextField";

const LocationLookup = ({
  onTripResults,
  closePopper,
  updateButtonClicked,
}) => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tollCheck, setTollCheck] = useState(false);
  const [borderCheck, setBorderCheck] = useState(false);
  const [state, setState] = useState({
    isGPSChecked: false,
    locationValue: '',
    loc2Value: null,
    suggestions: [],
    suggestions2: [],
    tripResults: null,
    selectedRoutingMethod: null,
  });

  const getGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setState((prevState) => ({
            ...prevState,
            locationValue: `${latitude}${longitude}`,
          }));
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          setState((prevState) => ({ ...prevState, locationValue: null }));
        }
      );
    } else {
      console.error("Geolocation is not supported in this browser.");
      setState((prevState) => ({ ...prevState, locationValue: null }));
    }
  };

  const handleButtonClick = () => {
    // Call the updateButtonClicked function with the new value
    updateButtonClicked(true);
  };

  const handleOnClick = () => {
    testRunTrip();
    handleButtonClick();
  };

  const handleGPSboxChange = () => {
    setState((prevState) => ({
      ...prevState,
      isGPSChecked: !prevState.isGPSChecked,
      locationValue: prevState.isGPSChecked ? null : prevState.locationValue,
    }));

    if (!state.isGPSChecked) {
      getGeolocation();
    }
  };

  const handleAvoidToll = () => {
    setTollCheck(!tollCheck);
  };

  const isTollChecked = () => {
    return tollCheck;
  };

  const handleCheckborderChange = () => {
    setBorderCheck(!borderCheck);
  };

  const isBorderChecked = () => {
    return borderCheck;
  };

  useEffect(() => {
    if (state.locationValue && state.locationValue.length >= 3) {
      setLoading(true); // Set loading state to true before making API call
      fetchSuggestions(state.locationValue).then((suggestions) => {
        setState((prevState) => ({ ...prevState, suggestions }));
        setLoading(false); // Set loading state back to false after API call
      });
    }else {
      setState((prevState) => ({ ...prevState, suggestions: [] }));
    }
  }, [state.locationValue]);

  useEffect(() => {
    if (state.loc2Value && state.loc2Value.length >= 3) {
      setLoading(true); // Set loading state to true before making API call
      fetchSuggestions(state.loc2Value).then((suggestions2) => {
        setState((prevState) => ({ ...prevState, suggestions2 }));
        setLoading(false); // Set loading state back to false after API call
      });
    } else {
      setState((prevState) => ({ ...prevState, suggestions2: [] }));
    }
  }, [state.loc2Value]);

  const fetchSuggestions = (query) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        fetch(
          `https://prime.promiles.com/WebAPI/api/ValidateLocation?locationText=${query}&apikey=${lookUpKey}`
        )
          .then((response) => response.json())
          .then((data) =>
            data.map((item) => `${item.City}, ${item.State}, ${item.PostalCode}`)
          )
          .then(resolve)
          .catch(reject);
      }, 500); // 500 milliseconds delay
    });
  };
  
 
  const handleInputChange = (event, newInputValue) => {
    let modifiedValue = newInputValue;
   
    setState((prevState) => ({
      ...prevState,
      locationValue: modifiedValue,
    }));
  };

  const handleInputChange2 = (event, newInputValue) => {
    let modifiedValue = newInputValue;
    
    setState((prevState) => ({
      ...prevState,
      loc2Value: modifiedValue,
    }));
  };

  const handleSelectChange = (selected) => {
    setState((prevState) => ({
      ...prevState,
      selectedRoutingMethod: selected,
    }));
  };

  const [tripResults, setTripResults] = useState(null);

  const testRunTrip = () => {
    setTripResults(null); // Reset tripResults to null

    setLoading(true); // Set loading state to true before making API call
    closePopper();
    // Simulating loading time with setTimeout

    const { locationValue, loc2Value, isGPSChecked } = state;
   
    let latitude = "";
    let longitude = "";

    if (isGPSChecked && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lon } = position.coords;
          latitude = lat;
          longitude = lon;
          fetchTrip(latitude, longitude, locationValue, loc2Value);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          fetchTrip(latitude, longitude, locationValue, loc2Value);
        }
      );
    } else {
      fetchTrip(latitude, longitude, locationValue, loc2Value);
    }
  };

  const fetchTrip = (latitude, longitude, locationValue, loc2Value) => {
    const trip = {
      TripLegs: [
        {
          Address: "",
          City: "",
          State: "",
          PostalCode: "",
          Latitude: state.isGPSChecked ? latitude : "", // Use latitude if GPS is checked
          Longitude: state.isGPSChecked ? longitude : "", // Use longitude if GPS is checked
          LocationText: state.isGPSChecked ? null : locationValue, // Use locationValue if GPS is not checked
        },
        {
          LocationText: loc2Value || null,
        },
      ],
      UnitMPG: 6,
      RoutingMethod: state.selectedRoutingMethod
        ? state.selectedRoutingMethod.label
        : "Practical",
      BorderOpen: isBorderChecked(),
      AvoidTollRoads: isTollChecked(),
      VehicleType: 7,
      AllowRelaxRestrictions: false,
      GetDrivingDirections: true,
      GetMapPoints: true,
      GetStateMileage: true,
      GetTripSummary: true,
      GetTruckStopsOnRoute: false,
      GetFuelOptimization: false,
      apikey: tmAPIKey,
    };

    fetch("https://prime.promiles.com/WebAPI/api/RunTrip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(trip),
    })
      .then((response) => response.json())
      .then((data) => {
        setTripResults(data); // Update tripResults with new data
        onTripResults(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false); // Set loading state to false after API call resolves
      });
  };

  const { locationValue, loc2Value, suggestions, suggestions2 } = state;

  return (
    <>
      <div style={{ background: "#3c3c3c" }}>
        <label>
          <div
            style={{ background: "#0082CB", padding: "5px" }}
            className=" rounded-sm m-1 p-1"
          >
            <form>
              <div className="flex items-center ">
                <Checkbox.Root
                  className="CheckboxRoot"
                  checked={!state.isGPSChecked}
                  onChange={handleGPSboxChange}
                  id="c1"
                >
                  <Checkbox.Root className="CheckboxRoot" id="c1">
                    <Checkbox.Indicator className="CheckboxIndicator">
                      <CheckIcon />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                </Checkbox.Root>
                <label className="Label whitespace-nowrap " htmlFor="c1">
                  Start at my GPS Location
                </label>

                <MyLocationIcon className="text-white ml-auto" />
              </div>
            </form>
          </div>
        </label>

        <div className="searchBoxWrapper">
          <Autocomplete
            className="searchBox text-black px-1 my-2 w-60 mx-auto rounded-sm"
            options={suggestions}
            loading={loading}
            id="disable-portal"
            disablePortal          
            style={{
              backgroundColor: "white",
              maxWidth: "300px",
              margin: "0 auto",
              borderRadius: "2",
            }}
            value={locationValue}
            onChange={(event, newValue) =>
              setState((prevState) => ({
                ...prevState,
                locationValue: newValue,
              }))
            }
            onInputChange={handleInputChange}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="e.g. houston, tx"
                variant="standard"
                label="Origin"
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
                  style: { color: "primary" }, // Change label color here
                }}
              />
            )}
          />
        </div>
        <div className="searchBoxWrapper">
          <Autocomplete
            className="searchBox text-black px-1 my-2 w-60 mx-auto rounded-sm"
            options={suggestions2}
            loading={loading}
            style={{
              backgroundColor: "white",
              maxWidth: "300px",
              margin: "0 auto",
            }}
            value={loc2Value}
            onChange={(event, newValue) =>
              setState((prevState) => ({ ...prevState, loc2Value: newValue }))
            }
            onInputChange={handleInputChange2}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="e.g. 19145"
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
                  style: { outline: "none" },
                }}
              />
            )}
          />
        </div>

        <MySelect onSelectChange={handleSelectChange} />

        <label className="flex justify-center">
          <div
            style={{ background: "#0082CB" }}
            className="w-60 rounded-sm m-1 p-1"
          >
            <form>
              <div>
                <Checkbox.Root
                  checked={!tollCheck}
                  onChange={handleAvoidToll}
                  id="c2"
                >
                  <Checkbox.Root className="CheckboxRoot" id="c2">
                    <Checkbox.Indicator className="CheckboxIndicator">
                      <CheckIcon />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                </Checkbox.Root>
                <label className="Label" htmlFor="c2">
                  Avoid Toll
                </label>
              </div>
              {/* You can use the isCheckboxChecked function as needed */}
            </form>
          </div>
        </label>

        <label className="flex justify-center">
          <div
            style={{ background: "#0082CB" }}
            className="w-60 rounded-sm m-1 p-1"
          >
            <form>
              <div>
                <Checkbox.Root
                  checked={!borderCheck}
                  onChange={() => handleCheckborderChange("borderCheck")}
                  id="c3"
                >
                  <Checkbox.Root className="CheckboxRoot" id="c3">
                    <Checkbox.Indicator className="CheckboxIndicator">
                      <CheckIcon />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                </Checkbox.Root>
                <label className="Label" htmlFor="c3">
                  Border Closed
                </label>
              </div>
            </form>
          </div>
          <br />
        </label>

        <div>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Chip
              style={{
                background: "#0082CB",
                padding: "2px 4px",
                color: "#fff",
                margin: "10px 1%",
              }}
              label="Run Trip"
              variant="outlined"
              onClick={handleOnClick}
            />
          </Stack>

          {buttonClicked && !tripResults ? (
            <p
              style={{
                margin: "0.5rem 1rem",
                background: "#000",
                color: "white",
              }}
            >
              Loading...
            </p>
          ) : tripResults && tripResults.TripDistance ? (
            <>
              <p
                style={{
                  margin: "0.5rem 1rem",
                  background: "#000",
                  color: "white",
                }}
              >
                Trip Distance: {tripResults.TripDistance}
              </p>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};

LocationLookup.propTypes = {
  onTripResults: PropTypes.func.isRequired,
  closePopper: PropTypes.func.isRequired,
};

export default LocationLookup;
