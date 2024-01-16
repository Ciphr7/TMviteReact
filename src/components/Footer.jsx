import React, { useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { renderToString } from "react-dom/server";

import LocationLookup from "./LocationLookup";

const Footer = () => {
  // Create a ref to store the reference to the button element
  const buttonRef = useRef();

  // Initialize the popover using useEffect
  useEffect(() => {
    
  }, []);

  return (
    <footer className="text-bg-dark p-2 text-center">
     
<button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
  New Trip
</button>


<div  className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <LocationLookup />

      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-danger">Save changes</button>
      </div>
    </div>
  </div>
</div>
     

      <p>ProMiles Software Development Corp </p>
      <p>Copyright &copy; 2022 </p>
      <a href="/about">About</a>
    </footer>
  );
};

export default Footer;
