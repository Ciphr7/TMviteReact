import React, { useState, useEffect } from "react";
import tmLogo from "../images/tmLogo.png";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { lookUpKey } from "./tmAPIKey";
import ContactlessIcon from "@mui/icons-material/Contactless";
import PropTypes from "prop-types";

import "./LocationLookup.css";
import MySelect from "./RouteOptions";
import { Button } from "@mui/material";

const LocationLookup = ({ onTripResults }) => {

  const [tollCheck, setTollCheck] = useState(false);
  const [borderCheck, setBorderCheck] = useState(false);
  const [gpsCheck, setGPSCheck] = useState(false);

 

  const handleGPSChange = () => {
    if (gpsCheck) {
      // Checkbox is checked, get geolocation
      setState((prevState) => ({ ...prevState, locationValue: null, suggestions: [] }));
    } else {
      //setGPSCheck
      // Checkbox is not checked, set locationValue to null
      getGeolocation();
    }
  };
  const handleCheckboxChange = () => {
    const { isChecked } = state;
    setState((prevState) => ({ ...prevState, isChecked: !isChecked }));

    if (isChecked) {
      setState((prevState) => ({ ...prevState, locationValue: null, suggestions: [] }));
    } else {
      getGeolocation();
    }
  };

 

  const handleAvoidToll = () => {
    setTollCheck(!tollCheck);
  };

  const isCheckboxChecked = () => {
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
    isChecked: false,
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
            locationValue: `${latitude}:${longitude}`,
           
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

  

  const testRunTrip = () => {
    const { locationValue, loc2Value, isChecked } = state;

    const trip = {
      TripLegs: [
        {
          LocationText: locationValue || null,
        },
        {
          LocationText: loc2Value || null,
        },
      ],
      UnitMPG: 6,
      RoutingMethod: selectedValue ? selectedValue.label : 'Practical',
      BorderOpen: isBorderChecked() ? true : false,
      AvoidTollRoads: isCheckboxChecked() ? true : false,
      VehicleType: 7,
      AllowRelaxRestrictions: false,
      GetDrivingDirections: true,
      GetMapPoints: false,
      GetStateMileage: true,
      GetTripSummary: true,
      GetTruckStopsOnRoute: false,
      GetFuelOptimization: false,
      apikey: "TkkxbFNheDE2bndSTkwvbncrWFZGZz090",
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
        setState((prevState) => ({ ...prevState, tripResults: data }));
        onTripResults(data);
        
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const {
    isChecked,
    locationValue,
    loc2Value,
    suggestions,
    suggestions2,
    
  } = state;

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
                  checked={!state.isChecked}
                  onChange={handleCheckboxChange}
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
                <ContactlessIcon className="text-white ml-auto" />
              </div>
            </form>
          </div>
        </label>

        {/* Rest of your component code */}
        <div className="flex">
          <input
            className="searchBox text-black px-1 my-2 w-60 mx-auto "
            type="text"
            value={locationValue === null ? "" : locationValue}
            onChange={handleInputChange}
            placeholder="Search for Location"
          />
        </div>
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
        {suggestions2.length > 3 && (
          <ul className="mx-auto w-60 text-3 text-white p-2 font-bold bg-red-500">
            {suggestions2.map((suggestion2, index) => (
              <li key={index} onClick={() => handleSelect2(suggestion2)}>
                {suggestion2}
              </li>
            ))}
          </ul>
        )}
        <MySelect
          onSelectChange={handleSelectChange}
        />

        <label className="flex justify-center">
          <div style={{ background: "#f44336" }} className="w-60 rounded-sm m-1 p-1">
          <form>
      <div>
        <Checkbox.Root checked={!tollCheck} onChange={handleAvoidToll} id="c2">
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
          <div style={{ background: "#f44336" }} className="w-60 rounded-sm m-1 p-1">
            <form>
              <div>
                <Checkbox.Root checked={!borderCheck} onChange={() => handleCheckborderChange("borderCheck")} id="c3">
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
          <Button onClick={testRunTrip}>Run Trip</Button>
        </div>
      </div>
    </>
  );
};

LocationLookup.propTypes = {
  onTripResults: PropTypes.func.isRequired,
};

export default LocationLookup;
