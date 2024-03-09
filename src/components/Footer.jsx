import React, { useRef, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { CircularProgress } from "@mui/material";
import GoogleMap from "./GoogleMap";
import Popper from "@mui/material/Popper";
import Button from "@mui/material/Button";
import LocationLookup from "./LocationLookup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TripResults from "./TripResults";

import FuelAverages from "./FuelAverages";
import RouteIcon from "@mui/icons-material/Route";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import tmLogo from "../images/tmLogo.png";
import Disclaimer from "./Disclaimer";
import "./Footer.css";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Footer = () => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [tripResults, setTripResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [anchorEl3, setAnchorEl3] = React.useState(null);

  const [open, setOpen] = React.useState(true);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [open4, setOpen4] = React.useState(false);
  const [placement, setPlacement] = React.useState();
  const [placement2, setPlacement2] = React.useState();
  const [placement3, setPlacement3] = React.useState();
  const [placement4, setPlacement4] = React.useState();

  const updateButtonClicked = (value) => {
    setButtonClicked(value);
    setLoading(value); // Set loading state to true when button is clicked
  };

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

  const handleClosePopper = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen4(true);
  };
  const handleClickOpen2 = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen4(false);
  };
  const handleClose2 = () => {
    setOpen3(false);
  };
  const handleClose3 = () => {
    setOpen(false);
  };
  const handleTripResults = (results) => {
    console.log("Results received:", results);
    setTripResults(results);
    setButtonClicked(false); // Reset buttonClicked to false when trip results are received
    setLoading(false); // Set loading state to false when trip results are received
  };



  return (
    <footer
      style={{ background: "#3c3c3c", color: "#000", padding: "2px 0px" }}
    >
      <GoogleMap tripResults={tripResults} />
      <div>
        {loading ? (
          <div style={{ marginTop: "5px" }}>
            <CircularProgress color="primary" size={30} />
          </div>
        ) : tripResults && tripResults.TripDistance ? (
          <div
            className="rounded-lg"
            style={{
              marginTop: "0.5rem",
              margin: " auto",
              background: "#000",
              color: "white",
              maxWidth: "15rem",
              padding: "5px",
            }}
          >
            Trip Distance: {tripResults.TripDistance}
          </div>
        ) : null}
      </div>
      <Card
        style={{
          marginBottom: "6rem",
          marginTop: "0.3rem",
          paddingBottom: "2rem",
          background: "#000 ",
          color: "white",
          padding: "1px 1px",
          display: "inline-flex",
        }}
      >
        <CardContent>
          <div
            style={{
              background: "#0082CB",
              padding: "1px 1%",
              margin: "auto auto",
              display: "inline-flex",
            }}
          >
            <Button
              style={{
                background: "#3c3c3c",
                padding: "2px 2px",
                margin: "1px 1%",
              }}
              aria-describedby={open ? "alert-dialog-slide-description" : undefined}
              variant="contained"
              onClick={handleClickOpen2}
            >
              New Trip
              <LocalShippingIcon
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
              aria-describedby={open2 ? "simple-popover2" : undefined}
              variant="contained"
              onClick={handleClick2("top-start")}
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
              aria-describedby={open3 ? "simple-popover3" : undefined}
              variant="contained"
              onClick={handleClick3("top-end")}
            >
              Fuel Prices
              <AnalyticsIcon
                style={{
                  background: "#3c3c3c",
                  padding: "2px 2px",
                  margin: "1px 1%",
                }}
              />
            </Button>
            <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose2}
            aria-describedby="alert-dialog-slide-description"
            PaperProps={{
              style: {
                backgroundColor: "#333", // Dark background color
                color: "#fff", // White text color
              },
            }}
          >
            <DialogTitle>{"Trip Planner"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
              <LocationLookup
                  onTripResults={handleTripResults}
                  closePopper={handleClosePopper}
                  updateButtonClicked={updateButtonClicked}
                 
                />
              </DialogContentText>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose3}>Close</Button>
            </DialogActions>
          </Dialog>

          
            <Popper
              className="popper"
              id="simple-popover2"
              open={open2}
              anchorEl={anchorEl2}
              placement={placement2}
            >
              <Box
                className="popper-content"
                sx={{
                  borderRadius: 1,
                  borderColor: "#3c3c3c",
                  p: 1,
                  color: "white",
                  bgcolor: "#3c3c3c",
                }}
              >
                <TripResults tripResults={tripResults} />
              </Box>
            </Popper>
          </div>
          <Dialog
            open={open3}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose2}
            aria-describedby="alert-dialog-slide-description"
            PaperProps={{
              style: {
                backgroundColor: "#333", // Dark background color
                color: "#fff", // White text color
              },
            }}
          >
            <DialogTitle>{"Fuel Averages"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                <FuelAverages />
              </DialogContentText>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose2}>Close</Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={open4}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose2}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>{"TruckMiles Terms of Use"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                <Disclaimer />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Agree</Button>
            </DialogActions>
          </Dialog>
          <p> ProMiles Software Development Corp&copy;2024</p>
          <a
            className="underline hover:no-underline"
            href="https://promiles.wufoo.com/forms/z18t76641ihyp26/"
            target="_blank"
          >
            Feedback
          </a>{" "}
          |{" "}
          <a
            className="underline hover:no-underline"
            variant="outlined"
            onClick={handleClickOpen}
          >
            Terms of Use
          </a>
        </CardContent>
      </Card>
    </footer>
  );
};

export default Footer;
