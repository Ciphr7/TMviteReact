

// App.js
import React from 'react';
import Header from './components/Header';
import GoogleMapComponent from './components/GoogleMap';

import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header title="TruckMiles 2024" />
     
      <GoogleMapComponent />
 
      <Footer />
    </div>
  );
}



export default App
