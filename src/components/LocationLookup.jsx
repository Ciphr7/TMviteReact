import React, { Component } from "react";
import tmLogo from "../images/tmLogo.png";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";

import ContactlessIcon from "@mui/icons-material/Contactless";
import Origin from "./Origin";

import "./LocationLookup.css";
import MySelect from "./RouteOptions";

const Checkbox2 = ({ checked, onChange }) => (
  <div>
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span>Border Closed</span>
  </div>
);

class LocationLookup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
      locationValue: null,
      loc2Value: null,
      suggestions: [],
      suggestions2: [],
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
            suggestions: [`${latitude}:${longitude}`],
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
      `https://prime.promiles.com/WebAPI/api/ValidateLocation?locationText=${locationValue}&apikey=${"bU03MSs2UjZIS21HMG5QSlIxUTB4QT090"}`
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
      `https://prime.promiles.com/WebAPI/api/ValidateLocation?locationText=${loc2Value}&apikey=${"bU03MSs2UjZIS21HMG5QSlIxUTB4QT090"}`
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
    });
  };
  handleSelect2 = (selectedValue2) => {
    this.setState({
      loc2Value: selectedValue2,
      suggestions2: [selectedValue2],
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

  render() {
    const { isChecked, locationValue, loc2Value, suggestions, suggestions2 } =
      this.state;

    return (
      <>
        <div style={{background : '#3c3c3c'}}>
        <div className="flex justify-center">
          <img className=" h-20 pt-3 m-2 " src={tmLogo} alt="" />
          </div>
          <label className="flex  justify-center">
            <div className="bg-red-500 w-60 rounded-sm m-1 p-1">
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
          <Origin />
          <input
            className="searchBox px-1 my-2 bg-white w-60  "
            type="text"
            value={locationValue === null ? "" : locationValue}
            onChange={this.handleInputChange}
            placeholder="Search for Location"
          />

          <ul className="mx-auto text-3 text-white p-2 w-60     font-bold bg-red-500">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => this.handleSelect(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>

          <label>
            <input
              className="searchBox px-1 w-60  my-2 bg-white"
              type="text"
              value={loc2Value === null ? "" : loc2Value}
              onChange={this.handleInputChange2}
              placeholder="Search for Location"
            />
          </label>

          <ul className=" mx-auto w-60 text-3 text-white p-2 font-bold bg-red-500">
            {suggestions2.map((suggestion2, index) => (
              <li key={index} onClick={() => this.handleSelect2(suggestion2)}>
                {suggestion2}
              </li>
            ))}
          </ul>

          <MySelect />

          <label className="flex justify-center">
            <div className="  bg-red-500 w-60 rounded-sm m-1 p-1">
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
            <div className="  bg-red-500 w-60 rounded-sm m-1 p-1">
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
          </label>

          
        </div>
      </>
    );
  }
}

export default LocationLookup;
