import React, { useState, useEffect } from "react";
import tmLogo from "../images/tmLogo.png";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { lookUpKey, tmAPIKey } from "./tmAPIKey";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import "./LocationLookup.css";
import MySelect from "./RouteOptions";


const LocationLookup = ({ onTripResults, closePopper, updateButtonClicked }) => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tollCheck, setTollCheck] = useState(false);
  const [borderCheck, setBorderCheck] = useState(false);

  const handleButtonClick = () => {
    // Call the updateButtonClicked function with the new value
    updateButtonClicked(true);
    
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

  const [selectedValue, setSelectedValue] = useState(null);

  const handleSelectChange = (selected) => {
    setSelectedValue(selected);
  };

  const [state, setState] = useState({
    isGPSChecked: false,
    locationValue: null,
    loc2Value: null,
    suggestions: [],
    suggestions2: [],
    tripResults: null,
    selectedRoutingMethod: null,
  });

  useEffect(() => {
    if (state.locationValue && state.locationValue.length >= 3) {
      fetchSuggestions();
    }
  }, [state.locationValue]);

  useEffect(() => {
    if (state.loc2Value && state.loc2Value.length >= 3) {
      fetchSuggestions2();
    }
  }, [state.loc2Value]);

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

  const fetchSuggestions = () => {
    const { locationValue } = state;
    fetch(
      `https://prime.promiles.com/WebAPI/api/ValidateLocation?locationText=${locationValue}&apikey=${lookUpKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        const suggestions = data.map(
          (item) => `${item.City}, ${item.State}, ${item.PostalCode}`
        );
        setState((prevState) => ({ ...prevState, suggestions }));
      })
      .catch((error) => {
        console.error("Error fetching suggestions:", error);
      });
  };

  const fetchSuggestions2 = () => {
    const { loc2Value } = state;
    fetch(
      `https://prime.promiles.com/WebAPI/api/ValidateLocation?locationText=${loc2Value}&apikey=${lookUpKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        const suggestions2 = data.map(
          (item) => `${item.City}, ${item.State}, ${item.PostalCode}`
        );
        setState((prevState) => ({ ...prevState, suggestions2 }));
      })
      .catch((error) => {
        console.error("Error fetching suggestions2:", error);
      });
  };

  const handleInputChange = (e) => {
    const locationValue = e.target.value;
    setState((prevState) => ({ ...prevState, locationValue }));
  };

  const handleInputChange2 = (e) => {
    const loc2Value = e.target.value;
    setState((prevState) => ({ ...prevState, loc2Value }));
  };

  const handleSelect = (selectedValue) => {
    setState((prevState) => ({
      ...prevState,
      locationValue: selectedValue,
      suggestions: [selectedValue],
    }));
  };

  const handleSelect2 = (selectedValue2) => {
    setState((prevState) => ({
      ...prevState,
      loc2Value: selectedValue2,
      suggestions2: [selectedValue2],
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
        <div className="flex justify-center">
          <img className="h-20 pt-3 m-2" src={tmLogo} alt="" />
        </div>
        <label className="flex justify-center">
          <div
            style={{ background: "#f44336", padding: "5px" }}
            className="w-60 rounded-sm m-1 p-1"
          >
            <form>
              <div className="flex items-center ">
                <Checkbox.Root
                  className="CheckboxRoot"
                  checked={!state.isGPSChecked}
                  onChange={handleGPSboxChange}
                  id="c1"
                >
                  <Checkbox.Root className="CheckboxRoot" id="c1"
                  
                  >
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

        <div className="flex">
          <input
            className="searchBox text-black px-1 my-2 w-60 mx-auto "
            type="text"
            value={locationValue === null ? "" : locationValue}
            onChange={handleInputChange}
            placeholder="Search for Location"
          />
        </div>
        <div style={{ maxHeight: "250px", overflowY: "scroll" , scrollbarWidth: "none", msOverflowStyle: "none"}}>
        {suggestions.length > 3 && (
          <ul className="mx-auto text-3 text-white p-2 w-60 font-bold bg-red-500">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSelect(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}

        <label className="text-center flex">
          <input
            className="mx-auto text-black searchBox px-1 w-60 my-2"
            type="text"
            value={loc2Value === null ? "" : loc2Value}
            onChange={handleInputChange2}
            placeholder="Search for Location"
          />
        </label>
        </div>
        <div style={{ maxHeight: "250px", overflowY: "scroll", scrollbarWidth: "none", msOverflowStyle: "none"}}>
        {suggestions2.length > 3 && (
          <ul className="mx-auto w-60 text-3 text-white p-2 font-bold bg-red-500">
            {suggestions2.map((suggestion2, index) => (
              <li key={index} onClick={() => handleSelect2(suggestion2)}>
                {suggestion2}
              </li>
            ))}
          </ul>
        )}
        </div>
        <MySelect onSelectChange={handleSelectChange} />

        <label className="flex justify-center">
          <div
            style={{ background: "#f44336" }}
            className="w-60 rounded-sm m-1 p-1"
          >
            <form>
              <div>
                <Checkbox.Root
                  checked={!tollCheck}
                  onChange={handleAvoidToll}
                  id="c2"
                >
                  <Checkbox.Root className="CheckboxRoot" id="c1">
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
            style={{ background: "#f44336" }}
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
          <Button style={{ background: "#3c3c3c", padding: "2px 2px", margin: "1px 1%" }} onClick={ () => {testRunTrip(); handleButtonClick(); }}>Run Trip</Button>
         
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
