import React, { useState, useEffect, useRef } from "react";
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
import OriginAutocomplete from "./OriginAutocomplete";
import DestinationAutocomplete from "./DestinationAutocomplete";
const LocationLookup = (
  {
    onTripResults,
    closePopper,
    updateButtonClicked,
  }
) => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tollCheck, setTollCheck] = useState(false);
  const [borderCheck, setBorderCheck] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [destinationValue, setDestinationValue] = useState(null);
  const [originInputValue, setOriginInputValue] = useState('');
  const [destinationInputValue, setDestinationInputValue] = useState('');
  const [state, setState] = useState({
    isGPSChecked: false,
    locationValue: "", // Initialize locationValue
    loc2Value: "", // Initialize loc2Value
    suggestions: [],
    suggestions2: [],
    tripResults: null,
    selectedRoutingMethod: null,
  });

 
  const handleOriginChange = (newValue) => {
    setSelectedOrigin(newValue);
  };

  const handleDestinationChange = (newValue) => {
    setDestinationValue(newValue);
  };

  const handleOriginInputChange = (newValue) => {
    setOriginInputValue(newValue);
  };

  const handleDestinationInputChange = (newValue) => {
    setDestinationInputValue(newValue);
  };

  const getGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedOrigin({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          setSelectedOrigin(null);
        }
      );
    } else {
      console.error("Geolocation is not supported in this browser.");
      setSelectedOrigin(null);
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
      selectedOrigin: prevState.isGPSChecked ? null : prevState.selectedOrigin,
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
          LocationText: state.isGPSChecked ? null : selectedOrigin.text, // Use locationValue if GPS is not checked
        },
        {
          LocationText: destinationValue.text || null,
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

  

  return (
    <>
     <div className="flex justify-center">
        <img className="h-20 pt-3 m-2" src={tmLogo} alt="" />
      </div>
      <div style={{ background: "#3c3c3c" }}>
        <label>
          <div
            style={{ background: "#0082CB", padding: "5px" }}
            className=" rounded-sm m-1 p-1 mb-2"
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
        <OriginAutocomplete
          value={selectedOrigin}
          onChange={handleOriginChange}
          onInputChange={handleOriginInputChange}
          inputValue={originInputValue}
          isGPSChecked={state.isGPSChecked} 
          getOptionLabel={(option) =>
            state.isGPSChecked ? `${option.latitude}, ${option.longitude}` : option
          }
        />
        <DestinationAutocomplete
          value={destinationValue}
          onChange={handleDestinationChange}
          onInputChange={handleDestinationInputChange}
          inputValue={destinationInputValue}
        />
      </div>
        <div className="searchBoxWrapper"></div>

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
  // locationValue: PropTypes.string.isRequired,
  // loc2Value: PropTypes.string.isRequired,
  // setLocationValue: PropTypes.func.isRequired,
  // setLoc2Value: PropTypes.func.isRequired,
};


export default LocationLookup;
