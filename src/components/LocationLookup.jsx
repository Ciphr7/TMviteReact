import React, { useState, useEffect } from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import "./LocationLookup.css";
import MySelect from "./RouteOptions";
import Destination from "./Destination";
import Origin from "./Origin";
import { tmAPIKey } from "./tmAPIKey";

const LocationLookup = ({ onTripResults, updateButtonClicked }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItem2, setSelectedItem2] = useState(null);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tollCheck, setTollCheck] = useState(false);
  const [borderCheck, setBorderCheck] = useState(false);
  const [gpsCheck, setGpsCheck] = useState(false);

  // Initialize TripLegs state
  const [tripLegs, setTripLegs] = useState([
    { Address: "", City: "", State: "", PostalCode: "", Latitude: null, Longitude: null, LocationText: null },
    { LocationText: null }
  ]);

  const [tripResults, setTripResults] = useState(null);

  const handleSelectedItemChange = (newValue) => {
    setSelectedItem(newValue);
  };

  const handleSelectedItemChange2 = (newValue) => {
    setSelectedItem2(newValue);
  };

  const handleLatChange = (newLat) => {
    setLat(newLat);
  };

  const handleLonChange = (newLon) => {
    setLon(newLon);
  };

  const handleButtonClick = () => {
    updateButtonClicked(true);
  };

  const handleGPSboxChange = () => {
    setGpsCheck(!gpsCheck);
  };

  const handleSelectChange = (selected) => {
    // Define the logic for handling select change here
  };

  useEffect(() => {
    if (!gpsCheck) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLat(latitude);
            setLon(longitude);
          },
          (error) => {
            console.error("Error getting geolocation:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported");
      }
    }
  }, [gpsCheck]);

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

  const fetchTrip = (latitude, longitude) => {
    const trip = {
      TripLegs: [
        {
          Address: "",
          City: "",
          State: "",
          PostalCode: "",
          Latitude: gpsCheck ? latitude : "", // Use latitude if GPS is checked
          Longitude: gpsCheck ? longitude : "", // Use longitude if GPS is checked
          LocationText: gpsCheck ? null : (selectedItem?.text || null), // Set to null if GPS is true, otherwise use selectedItem.text
        },
        { LocationText: selectedItem2?.text || null },
      ],
      UnitMPG: 6,
      RoutingMethod: "Practical",
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
        setTripResults(data);
        onTripResults(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  const testRunTrip = () => {
    setTripResults(null);
    setLoading(true);
    console.log("gpsCheck:", gpsCheck);
    if (gpsCheck && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLat(latitude);
          setLon(longitude);
          fetchTrip(latitude, longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          setLoading(false);
        }
      );
    } else {
      fetchTrip(lat, lon);
    }
  };

  return (
    <>
      <div style={{ background: "#3c3c3c" }}>
        <Origin
          className="mx-auto w-60 p-2"
          selectedItem={selectedItem}
          updateSelectedItem={handleSelectedItemChange}
          lat={lat}
          lon={lon}
          handleLatChange={handleLatChange}
          handleLonChange={handleLonChange}
          handleGPSboxChange={handleGPSboxChange}
          noDataText="No data found"
          minLength={3}
          itemText="name"
          label="i.e 19145"
          isGPSChecked={gpsCheck}
        />
        <br />
        <Destination
          selectedItem2={selectedItem2}
          label="i.e Houston, tx"
          minLength={3}
          noDataText="No matching destinations found"
          itemText2="text"
          updateSelectedItem={handleSelectedItemChange2}
        />

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
                  onChange={handleCheckborderChange}
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
          <Button
            style={{
              background: "#3c3c3c",
              padding: "2px 2px",
              margin: "1px 1%",
            }}
            onClick={() => {
              testRunTrip();
              handleButtonClick();
            }}
          >
            Run Trip
          </Button>

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
  updateButtonClicked: PropTypes.func.isRequired,
};

export default LocationLookup;
