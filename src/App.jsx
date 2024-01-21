

// App.js
import React from 'react';
import Header from './components/Header';
import GoogleMapComponent from './components/GoogleMap';

import Footer from './components/Footer';

function App() {
  return (
    <div  className="App">
      <div className='wrapper'>
      <Header title="TruckMiles" />
     
      <GoogleMapComponent id='main' />
 
      <Footer />
      </div>
    </div>
  );
}



export default App
