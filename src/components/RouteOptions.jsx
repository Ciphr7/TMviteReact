import React, { useState } from 'react';
import Select from 'react-select';

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'white', // Change background color
    borderColor: state.isFocused ? 'red' : 'red', // Change border color
    ':hover': {
      backgroundColor: 'lightred', // Change hover-over color
      boxShadow: state.isFocused ? '0 0 0 2px red' : 'none',
    },

  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? 'black' : 'white', // Change option background color when selected
    color: state.isSelected ? 'white' : 'black', // Change option text color when selected
    ':hover': {
      backgroundColor: 'lightred', // Change hover-over color
    },
  }),
  // Add more styles as needed
};


const RtOptions = [
  { value: 'practical', label: 'Practical' },
  { value: 'shortest', label: 'Shortest' },
  { value: 'interstate', label: 'Interstate' }
];

const MySelect = ({ onSelectChange }) => {
  const [selectedOption, setSelectedOption] = useState(RtOptions[0]);

  const handleChange = (selected) => {
    setSelectedOption(selected);
    onSelectChange(selected);
  };

  return (
    <Select
      className="mx-auto w-60 p-2"
      options={RtOptions}
      styles={customStyles}
      value={selectedOption}
      onChange={handleChange}
      defaultValue={RtOptions[1]}
    />
  );
};

export default MySelect;
