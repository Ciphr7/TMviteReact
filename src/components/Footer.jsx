import React, { useRef, useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import GoogleMap from "./GoogleMap";
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
import PMO from "../images/pmo.png";  
import FF from "../images/fuelfinder.png"      
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
  const [open, setOpen] = React.useState(true);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [open4, setOpen4] = React.useState(false);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const updateButtonClicked = (value) => {
    setButtonClicked(value);
    setLoading(value); // Set loading state to true when button is clicked
  };

  const handleSelectedOriginChange = (origin) => {
    setSelectedOrigin(origin);
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
  const handleClickOpen3 = () => {
    setOpen2(true);
  };
  const handleClickOpen4 = () => {
    setOpen3(true);
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
  const handleClose4 = () => {
    setOpen2(false);
  };
  const handleTripResults = (results) => {
    console.log("Results received:", results);
    setTripResults(results);
    setButtonClicked(false); // Reset buttonClicked to false when trip results are received
    setLoading(false); // Set loading state to false when trip results are received
    window.scrollBy(0, -100);
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
              display: "flex",
            }}
          >
            <Button
              style={{
                background: "#3c3c3c",
                padding: "2px 2px",
                margin: "1px 1%",
              }}
              aria-describedby={
                open ? "alert-dialog-slide-description" : undefined
              }
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
              aria-describedby={
                open2 ? "alert-dialog-slide-description" : undefined
              }
              variant="contained"
              onClick={handleClickOpen3}
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
              aria-describedby={
                open3 ? "alert-dialog-slide-description" : undefined
              }
              variant="contained"
              onClick={handleClickOpen4}
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
          </div>
          <p>Powered by</p>
          <Button
            style={{
              background: "#3c3c3c",
              padding: "2px 1px",
              margin: "1px 1%",
              textDecoration: "none", // Remove underline from anchor tag
              color: "white", // Change text color
            }}
            variant="contained"
            component="a" // Render the button as an anchor tag
            href="https://www.promiles.com/promiles-online/" // Set the URL you want to open
            target="_blank" // Open the URL in a new tab
          >
            <p className="mx-1"> ProMiles Online</p>
           
         
            <img className="h-10 pt-2 m-1" src={PMO} alt="" />
          </Button>

          <Button
            style={{
              background: "#3c3c3c",
              padding: "2px 2px",
              margin: "1px 1%",
              textDecoration: "none", // Remove underline from anchor tag
              color: "white", // Change text color
            }}
            variant="contained"
            component="a" // Render the button as an anchor tag
            href="https://www.promiles.com/fuel-finder/" // Set the URL you want to open
            target="_blank" // Open the URL in a new tab
          >
            <p className="mx-1"> Fuel Finder</p>
           
            <img className="h-10 pt-2 m-1" src={FF} alt="" />
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
          <Dialog
            open={open2}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose4}
            aria-describedby="alert-dialog-slide-description"
            PaperProps={{
              style: {
                backgroundColor: "#333", // Dark background color
                color: "#fff", // White text color
              },
            }}
          >
            <DialogTitle className="flex flex-col items-center justify-center">
              <img className="h-20 pt-3 m-2" src={tmLogo} alt="" />
              <p>Trip Summary</p>
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                <TripResults tripResults={tripResults} />
              </DialogContentText>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose4}>Close</Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={open3}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose4}
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
