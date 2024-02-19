import React, { useRef, useEffect, useState } from "react";
import vTruck from "../images/truck.png";
import Box from "@mui/material/Box";
import GoogleMap from "./GoogleMap"
import Popper from "@mui/material/Popper";
import Button from "@mui/material/Button";
import LocationLookup from "./LocationLookup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TripResults from "./TripResults";
import NewMap from "./NewMap"
import FuelPrices from "./FuelPrices"
import RouteIcon from '@mui/icons-material/Route';
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AnalyticsIcon from '@mui/icons-material/Analytics';
import './Footer.css'



const Footer = () => {
  const [state, setState] = useState({
   
    tripResults: null,
   
  });
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [anchorEl3, setAnchorEl3] = React.useState(null);

  const [open, setOpen ] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);

  const [placement, setPlacement] = React.useState();
  const [placement2, setPlacement2] = React.useState();
  const [placement3, setPlacement3] = React.useState();

  const handleClick = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };

  const handleClick2 = (newPlacement) => (event) => {
    setAnchorEl2(event.currentTarget);
    setOpen2((prev) => placement2 !== newPlacement || !prev);
    setPlacement2(newPlacement);
  };

  const handleClick3 = (newPlacement) => (event) => {
    setAnchorEl3(event.currentTarget);
    setOpen3((prev) => placement3 !== newPlacement || !prev);
    setPlacement3(newPlacement);
  };


  const id = open ? "simple-popover" : undefined;
  const id2 = open2 ? "simple-popover2" : undefined;
  const id3 = open3 ? "simple-popover3" : undefined;
  // Create a ref to store the reference to the button element
  const buttonRef = useRef();

  // Initialize the popover using useEffect
  useEffect(() => {}, []);

  const [tripResults, setTripResults] = useState(null);
  const handleTripResults = (results) => {
    console.log('Results received:', results);

    setTripResults(results);
  };

  return (
    <footer
      style={{ background: "#3c3c3c", color: "#000", padding: "2px 0px" }}

    >
      {/* <NewMap tripResults={tripResults} /> */}


      <GoogleMap tripResults={tripResults}  />
      {/* <NewMap tripResults={tripResults} /> */}
      <Card
        style={{
          margin: "1rem 1rem",
          background: "#000 ",
          color: "white",
          padding: "1px 1px",
          display: "inline-flex"
        }}
      >
        <CardContent>
          <div
            style={{
              background: "#f44336",
              padding: "1px 1%",
              margin: "auto auto",
              display: "inline-flex"
            }}
          >
            <Button
              style={{
                background: "#3c3c3c",
                padding: "2px 2px",
                margin: "1px 1%",
              }}
              aria-describedby={id}
              variant="contained"
              onClick={handleClick('top-end')}
            >New Trip
              <LocalShippingIcon style={{
                background: "#3c3c3c",
                padding: "2px 2px",
                margin: "1px 1%",
              }} />
             
              
            </Button>
            
            <Button
              style={{
                background: "#3c3c3c",
                padding: "2px 2px",
                margin: "1px 1%",
              }}
              aria-describedby={id}
              variant="contained"
              onClick={handleClick2('top-start')}
            >
            
                Trip Summary
                <RouteIcon 
                style={{
                  background: "#3c3c3c",
                  padding: "2px 2px",
                  margin: "1px 1%",
                }}
                />
              
            </Button>
            <Button
              style={{
                background: "#3c3c3c",
                padding: "2px 2px",
                margin: "1px 1%",
              }}
              aria-describedby={id}
              variant="contained"
              onClick={handleClick3('')}
            >Fuel Prices
             <AnalyticsIcon style={{
                background: "#3c3c3c",
                padding: "2px 2px",
                margin: "1px 1%",
              }} />
               
              
            </Button>

            <Popper
            className="popper"
              style={{
                background: "transparent",
                color: "#fff",
                padding: "10px",
              }}
              id={id}
              open={open}
              anchorEl={anchorEl}
              placement={placement}
              
            >
            
              <Box sx={{ border: 0, p: 1, bgcolor: "#3c3c3c" }}>
                <LocationLookup onTripResults={handleTripResults} />
              </Box>
            </Popper>
            <Popper
            className="popper"
              style={{
                background: "transparent",
                color: "#fff",
                padding: "10px",
              }}
              id={id2}
              open={open2}
              anchorEl={anchorEl2}
              placement={placement2}
            >
              <Box className="popper-content" sx={{ border: 0, p: 1, bgcolor: "#3c3c3c" }}>
                <TripResults tripResults={tripResults}  />
              
              </Box>
            </Popper>
            <Popper
              style={{
                background: "transparent",
                color: "#fff",
                padding: "10px",
              }}
              id={id3}
              open={open3}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'center',
                horizontal: 'right',
              }}
            >
              <Box sx={{ border: 0, p: 1, bgcolor: "#3c3c3c" }}>
                
              <FuelPrices />
              </Box>
            </Popper>
            </div>
            <p> ProMiles Software Development Corp&copy;2024</p>

            <a href="/about">About</a>
          
        </CardContent>
      </Card>
     
    </footer>
  );
};

export default Footer;
