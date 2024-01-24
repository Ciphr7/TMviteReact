import React, { Component } from "react";
import tmLogo from "../images/tmLogo.png";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { lookUpKey, tmAPIKey } from './tmAPIKey';
import ContactlessIcon from "@mui/icons-material/Contactless";
import PropTypes from 'prop-types';
import TripResults from "./TripResults";
import "./LocationLookup.css";
import MySelect from "./RouteOptions";
import { Button } from "@mui/material";

const Checkbox2 = ({ checked, onChange }) => (
  <div>
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span>Border Closed</span>
  </div>
);
//const { tripResults } = props;

class LocationLookup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
      locationValue: null,
      locationValue2: null,
      loc2Value: null,
      suggestions: [],
      suggestions2: [],
      tripResults: null,
      
    };
  }

  // Function to get the user's current location
  getGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Extract latitude and longitude from the position object
          const { latitude, longitude } = position.coords;
          this.setState({
            locationValue: `${latitude}:${longitude}`,
          });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          this.setState({ locationValue: null });
        }
      );
    } else {
      console.error("Geolocation is not supported in this browser.");
      this.setState({ locationValue: null });
    }
  };

  fetchSuggestions = () => {
    const { locationValue } = this.state;

    fetch(
      `https://prime.promiles.com/WebAPI/api/ValidateLocation?locationText=${locationValue}&apikey=${lookUpKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        const suggestions = data.map(
          (item) => `${item.City}, ${item.State}, ${item.PostalCode}`
        );
        this.setState({ suggestions });
      })
      .catch((error) => {
        console.error("Error fetching suggestions:", error);
      });
  };

  fetchSuggestions2 = () => {
    const { loc2Value } = this.state;

    fetch(
      `https://prime.promiles.com/WebAPI/api/ValidateLocation?locationText=${loc2Value}&apikey=${lookUpKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        const suggestions2 = data.map(
          (item) => `${item.City}, ${item.State}, ${item.PostalCode}`
        );
        this.setState({ suggestions2 });
      })
      .catch((error) => {
        console.error("Error fetching suggestions2:", error);
      });
  };

  handleInputChange = (e) => {
    this.setState({ locationValue: e.target.value }, () => {
      if (this.state.locationValue.length >= 3) {
        this.fetchSuggestions();
      }
    });
  };

  handleInputChange2 = (e) => {
    this.setState({ loc2Value: e.target.value }, () => {
      if (this.state.loc2Value.length >= 3) {
        this.fetchSuggestions2();
      }
    });
  };

  handleSelect = (selectedValue) => {
    this.setState({
      locationValue: selectedValue,
      suggestions: [selectedValue],
      suggestions: [],
    });
  };
  handleSelect2 = (selectedValue2) => {
    this.setState({
      loc2Value: selectedValue2,
      suggestions2: [selectedValue2],
      suggestions2: [],
    });
  };

  // Function to handle checkbox change
  handleCheckboxChange = () => {
    const { isChecked } = this.state;
    this.setState({ isChecked: !isChecked });

    // Set the input value based on the checkbox state
    if (isChecked) {
      this.setState({ locationValue: null, suggestions: [] });
    } else {
      this.getGeolocation();
    }
  };
  handleTripResults = (results) => {
    // Do something with the trip results, e.g., update state
    this.setState({ tripResults: results });
    console.log(results.TripLegs[0].LocationText);
  };

  testRunTrip = () => {
    const {
      locationValue,
      loc2Value,
      selectedRoutingMethod,
      borderCheck,
      tollCheck,
      tmAPIKey,
    } = this.state;
  
    const trip = {
      TripLegs: [
        {
          Address: "",
          City: "",
          State: "",
          PostalCode: "",
          Latitude: "",
          Longitude: "",
          LocationText: locationValue ? locationValue : null,
        },
        {
          Address: "",
          City: "",
          State: "",
          PostalCode: "",
          Latitude: "",
          Longitude: "",
          LocationText: loc2Value ? loc2Value : null,
        },
      ],
      UnitMPG: 6,
      RoutingMethod: selectedRoutingMethod,
      BorderOpen: borderCheck,
      AvoidTollRoads: tollCheck,
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
       // console.log(this.selectedItem);
        console.log(JSON.stringify(data));
        this.handleTripResults(data); // Use this.handleTripResults
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  
  
  

  render() {
    const { isChecked, locationValue, loc2Value, suggestions, suggestions2 } =
      this.state;

    return (
      <>
      <TripResults tripResults={this.state.tripResults} />
        <div style={{ background: "#3c3c3c" }}>
          <div className="flex justify-center">
            <img className=" h-20 pt-3 m-2 " src={tmLogo} alt="" />
          </div>
          <label className="flex  justify-center">
            <div
              style={{ background: "#f44336 ", padding: "5px" }}
              className="w-60 rounded-sm m-1 p-1"
            >
              <form>
                <div className="flex items-center ">
                  <Checkbox.Root
                    className="CheckboxRoot"
                    checked={!isChecked}
                    onChange={this.handleCheckboxChange}
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

          <div className="flex">
            <input
              className=" searchBox text-black px-1 my-2 w-60 mx-auto "
              type="text"
              value={locationValue === null ? "" : locationValue}
              onChange={this.handleInputChange}
              placeholder="Search for Location"
            />
          </div>
          {suggestions.length > 0 && (
            <ul className="mx-auto text-3 text-white p-2 w-60     font-bold bg-red-500">
              {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => this.handleSelect(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}

          <label className="text-center flex">
            <input
              className=" mx-auto text-black searchBox px-1 w-60  my-2"
              type="text"
              value={loc2Value === null ? "" : loc2Value}
              onChange={this.handleInputChange2}
              placeholder="Search for Location"
            />
          </label>
          {suggestions2.length > 0 && (
            <ul className=" mx-auto w-60 text-3 text-white p-2 font-bold bg-red-500">
              {suggestions2.map((suggestion2, index) => (
                <li key={index} onClick={() => this.handleSelect2(suggestion2)}>
                  {suggestion2}
                </li>
              ))}
            </ul>
          )}
          <MySelect />

          <label className="flex justify-center">
            <div
              style={{ background: "#f44336" }}
              className="w-60 rounded-sm m-1 p-1"
            >
              <form>
                <div>
                  <Checkbox.Root v-model="tollCheck" id="c2">
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
              className=" w-60 rounded-sm m-1 p-1"
            >
              <form>
                <div>
                  <Checkbox.Root className="CheckboxRoot" id="c3">
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

            <div><Button onClick={this.testRunTrip}>Run Trip</Button></div>
            {/* { tresults.TripDistance? tresults.TripDistance:null } */}
          
        </div>
      </>
    );
  }
}

LocationLookup.propTypes = {
  onTripResults: PropTypes.func.isRequired, // Define the prop type
  tripResults: PropTypes.object,
  
};

export default LocationLookup;
