import React, { Component } from 'react';
import MySelect from './RouteOptions';
import vTruck from '../images/truck.png';

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
            suggestions: [`${latitude}:${longitude}`]
          });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
          this.setState({ locationValue: null });
        }
      );
    } else {
      console.error('Geolocation is not supported in this browser.');
      this.setState({ locationValue: null });
    }
  };

  fetchSuggestions = () => {
    const { locationValue } = this.state;

    fetch(
      `https://prime.promiles.com/WebAPI/api/ValidateLocation?locationText=${locationValue}&apikey=${'bU03MSs2UjZIS21HMG5QSlIxUTB4QT090'}`
    )
      .then((response) => response.json())
      .then((data) => {
        const suggestions = data.map(
          (item) => `${item.City}, ${item.State}, ${item.PostalCode}`
        );
        this.setState({ suggestions });
      })
      .catch((error) => {
        console.error('Error fetching suggestions:', error);
      });
  };

  fetchSuggestions2 = () => {
    const { loc2Value } = this.state;

    fetch(
      `https://prime.promiles.com/WebAPI/api/ValidateLocation?locationText=${loc2Value}&apikey=${'bU03MSs2UjZIS21HMG5QSlIxUTB4QT090'}`
    )
      .then((response) => response.json())
      .then((data) => {
        const suggestions2 = data.map(
          (item) => `${item.City}, ${item.State}, ${item.PostalCode}`
        );
        this.setState({ suggestions2 });
      })
      .catch((error) => {
        console.error('Error fetching suggestions2:', error);
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
    this.setState({ locationValue: selectedValue, suggestions: [selectedValue] });
  };
  handleSelect2 = (selectedValue2) => {
    this.setState({ loc2Value: selectedValue2, suggestions2: [selectedValue2]});
  };

  // Function to handle checkbox change
  handleCheckboxChange = () => {
    const { isChecked } = this.state;
    this.setState({ isChecked: !isChecked });

    // Set the input value based on the checkbox state
    if (isChecked) {
      this.setState({ locationValue: null, suggestions: []  });
    } else {
      this.getGeolocation();
    }
  };

  render() {
    const { isChecked, locationValue,loc2Value,suggestions, suggestions2 } = this.state;

    return (
      <>
        <label className="block">
          <div className='flex bg-red-600 w-60 rounded-sm m-1 p-1'>
            <input
              className=" checked:bg-blue-500 w-10 h-5 "
              type="checkbox"
              checked={isChecked}
              onChange={this.handleCheckboxChange}
            />
            <span className="block text-sm font-sm text-white">Start at my GPS Location</span>
          </div>
        </label>

        <br />

        <label>
          <input
            className='searchBox p-1 m-2'
            type="text"
            value={locationValue === null ? '' : locationValue}
            onChange={this.handleInputChange}
            placeholder="Search for Location"
          />
        </label>

        <ul className="text-3 text-white p-2 text-center font-bold bg-red-600">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => this.handleSelect(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>

        <label>
          <input
            className='searchBox p-1 m-2'
            type="text"
            value={loc2Value === null ? '' : loc2Value}
            onChange={this.handleInputChange2}
            placeholder="Search for Location"
          />
        </label>

        <ul className="text-3 text-white p-2 text-center font-bold bg-red-600">
          {suggestions2.map((suggestion2, index) => (
            <li key={index} onClick={() => this.handleSelect2(suggestion2)}>
              {suggestion2}
            </li>
          ))}
        </ul>

        <MySelect />

        <div className='flex bg-red-600 w-60 rounded-sm m-1 p-1'>
          <input type="checkbox" className=" checked:bg-blue-500 w-10 h-5 " />
          <span className="block text-sm font-sm text-white w-40">Close Borders</span>
        </div>

        <div className='flex bg-red-600 rounded-sm w-60 m-1 p-1'>
          <input type="checkbox" className=" checked:bg-blue-500 w-10 h-5 " />
          <span className="block text-sm font-sm text-white ">Avoid Toll</span>
        </div>

        <img
          className=' w-54 h-24 pt-3 m-2'
          alt='TurckMiles Logo'
          src={vTruck}
        />
      </>
    );
  }
}

export default LocationLookup;
