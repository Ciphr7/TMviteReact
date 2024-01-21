import React, { useRef, useEffect } from "react";
import vTruck from "../images/truck.png";
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';

import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import LocationLookup from "./LocationLookup";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const Footer = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };



  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  // Create a ref to store the reference to the button element
  const buttonRef = useRef();

  // Initialize the popover using useEffect
  useEffect(() => {}, []);

  return (
    <footer  style={{ background : '#3c3c3c', color: '#000', padding: '20px' }} >
     <Card style={{margin: '1% 0',  background : '#f44336 ', color: 'white', padding: '10px' }}>
      <CardContent>
      
      <Button style={{background : '#3c3c3c', padding: '5px 20px' }} aria-describedby={id} variant="contained" onClick={handleClick}>
      
      <img
            className="w-15 h-10 pt-3 m-2 "
            alt="TurckMiles Logo"
            src={vTruck}
          /> <p style={{padding: '5px'}}>  New Trip</p> 
      </Button>

      
    

      <Popper style={{ background : 'transparent', color: '#fff', padding: '10px' }}  id={id} open={open} anchorEl={anchorEl}>
        <Box sx={{ border: 0, p: 1, bgcolor: '#3c3c3c' }}>
         <LocationLookup />
        </Box>
      </Popper>
      <p className="p"> ProMiles Software Development Corp&copy;2024</p>

      <a href="/about">About</a>
      </CardContent>
      </Card>
    </footer>
  );
};

export default Footer;
