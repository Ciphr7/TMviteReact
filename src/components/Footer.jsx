import React, { useRef, useEffect } from "react";

import DialogDemo from "./Dialog";



const Footer = () => {
  // Create a ref to store the reference to the button element
  const buttonRef = useRef();

  // Initialize the popover using useEffect
  useEffect(() => {
    
  }, []);

  return (
    <footer className="text-bg-dark p-2 text-center">
  
     


<DialogDemo />
     

      <p>ProMiles Software Development Corp &copy; 2024 </p>
    
      <a href="/about">About</a>
    </footer>
  );
};

export default Footer;
