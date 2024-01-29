import React, { useRef, useEffect, useState } from "react";
import vTruck from "../images/truck.png";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Button from "@mui/material/Button";
import LocationLookup from "./LocationLookup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TripResults from "./TripResults";


import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const Footer = () => {
  const [state, setState] = useState({
   
    tripResults: null,
   
  });
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [anchorEl2, setAnchorEl2] = React.useState(null);

  const [open, setOpen] = React.useState(false);

  const [placement, setPlacement] = React.useState();
  
  const handleClick = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };
  const handleClick2 = (event) => {
    setAnchorEl2(anchorEl2 ? null : event.currentTarget);
  };

  const open2 = Boolean(anchorEl2);
  const id = open ? "simple-popover" : undefined;
  const id2 = open2 ? "simple-popover2" : undefined;
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
      <Card
        style={{
          margin: "1rem 5rem",
          background: "#000 ",
          color: "white",
          padding: "1px 1px",
        }}
      >
        <CardContent>
          <div
            style={{
              background: "#f44336",
              padding: "1px 1%",
              margin: "auto auto",
            }}
          >
            <Button
              style={{
                background: "#3c3c3c",
                padding: "5px 25px",
                margin: "auto 1%",
              }}
              aria-describedby={id}
              variant="contained"
              onClick={handleClick('top-end')}
            >
              <span>
                <img
                  className="w-15 h-10 pt-2 m-2"
                  alt="TurckMiles Logo"
                  src={vTruck}
                />
                New Trip
              </span>
            </Button>
            
            <Button
              style={{
                background: "#3c3c3c",
                padding: "5px 25px",
                margin: "auto 1%",
              }}
              aria-describedby={id}
              variant="contained"
              onClick={handleClick2}
            >
              <span>
                <img
                  className="w-15 h-10 pt-2 m-2"
                  alt="TurckMiles Logo"
                  src={vTruck}
                />
                Trip Summary
              </span>
            </Button>

            <Popper
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
              style={{
                background: "transparent",
                color: "#fff",
                padding: "10px",
              }}
              id={id2}
              open={open2}
              anchorEl={anchorEl2}
            >
              <Box sx={{ border: 0, p: 1, bgcolor: "#3c3c3c" }}>
                <TripResults tripResults={tripResults}  />
              
              </Box>
            </Popper>
            <p> ProMiles Software Development Corp&copy;2024</p>

            <a href="/about">About</a>
          </div>
        </CardContent>
      </Card>
    </footer>
  );
};

export default Footer;
