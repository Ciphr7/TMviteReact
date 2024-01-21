// Import necessary modules
import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// Sample data for Autocomplete options
const options = ['React', 'Angular', 'Vue', 'Svelte'];
const theme = createTheme({
    palette: {
      primary: {
        main: '#2196f3', // Change primary color
      },
    },
  });
// Main App component
function App() {
  const [selectedOption, setSelectedOption] = React.useState(null);

  const handleOptionChange = (event, value) => {
    setSelectedOption(value);
  };

  return (
    <ThemeProvider theme={theme}>
    <div style={{background : 'white', padding: '20px' }}>
      <h1 style={{ color: '#2196f3' }}>Material-UI Autocomplete Example</h1>
      <Autocomplete
        value={selectedOption}
        onChange={handleOptionChange}
        options={options}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Framework"
            variant="outlined"
            color="primary"
            size="small" // Change size to small
          />
        )}
        style={{ width: '300px', marginTop: '10px' }} // Change width and margin
      />
      <div style={{ marginTop: '20px' }}>
        {selectedOption && <p>You selected: {selectedOption}</p>}
      </div>
    </div>
  </ThemeProvider>
  );
}

export default App;
