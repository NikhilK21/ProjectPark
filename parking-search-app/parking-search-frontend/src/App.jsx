import React, { useState, useEffect } from "react";
import MapComponent from "./components/MapComponent";
import axios from "axios";

const App = () => {
  const [parkingSpots, setParkingSpots] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/parking") // Adjust to your backend API
      .then((response) => {
        setParkingSpots(response.data);
      })
      .catch((error) => {
        console.error("Error fetching parking spots:", error);
      });
  }, []);

  return (
    <div>
      <h1>Parking Search App</h1>
      <MapComponent parkingSpots={parkingSpots} />
    </div>
  );
};

export default App;
