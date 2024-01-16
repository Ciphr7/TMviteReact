import React, { useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { renderToString } from 'react-dom/server';

const Footer = () => {
  // Create a ref to store the reference to the button element
  const buttonRef = useRef();

  // Initialize the popover using useEffect
  useEffect(() => {
    if (buttonRef.current) {
      import('bootstrap/dist/js/bootstrap.bundle.min.js').then((bootstrap) => {
        const content = renderToString(
          <div>
            <p>TruckMiles Trip Planner</p>
            <img src="src/images/tmLogo.png" alt="Your Image" width="50%" />
          </div>
        );

        const popover = new bootstrap.Popover(buttonRef.current, {
          content: () => content, // Use a function for dynamic content
          placement: 'top',
          html: true, // Enable HTML in popover content
        });

        return () => {
          popover.dispose();
        };
      });
    }
  }, []);

  return (
    <footer className="text-bg-dark p-2 text-center">
      <button
        ref={buttonRef}
        type="button"
        className="btn btn-primary"
        data-bs-toggle="popover"
        title="TruckMiles Trip Planner"
      >
        New Trip
      </button>

      <p>ProMiles Software Development Corp </p>
      <p>Copyright &copy; 2022 </p>
      <a href="/about">About</a>
    </footer>
  );
};

export default Footer;
