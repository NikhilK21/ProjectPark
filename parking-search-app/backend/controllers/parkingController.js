export const addParkingSpot = async (req, res) => {
    try {
      console.log("Received Data:", req.body); // Debug input values
  
      let { name, latitude, longitude, fare, amenities } = req.body;
  
      if (!name || !latitude || !longitude || !fare) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      latitude = parseFloat(latitude.toFixed(6));  // Fix decimal places
      longitude = parseFloat(longitude.toFixed(6));
  
      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ message: "Latitude and longitude must be valid numbers" });
      }
  
      const newParkingSpot = new ParkingSpot({
        name,
        latitude,
        longitude,
        fare,
        amenities: amenities.split(","),
      });
  
      await newParkingSpot.save();
      res.status(201).json({ message: "Parking spot added successfully", parkingSpot: newParkingSpot });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ message: "Error fetching parking spot", error: error.message });
      }      
  };

  import mongoose from "mongoose";
import ParkingSpot from "../models/ParkingSpot.js";

export const getParkingSpotById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🚀 Request received for Parking Spot ID:", id); // Debugging

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("❌ Invalid MongoDB ID:", id);
      return res.status(400).json({ message: "Invalid parking spot ID" });
    }

    const parkingSpot = await ParkingSpot.findById(id);

    if (!parkingSpot) {
      console.log("❌ No parking spot found for ID:", id);
      return res.status(404).json({ message: "Parking spot not found" });
    }

    console.log("✅ Parking Spot Found:", parkingSpot);
    res.json(parkingSpot);
  } catch (error) {
    console.error("❌ Error fetching parking spot:", error);
    res.status(500).json({ message: "Error fetching parking spot", error: error.message });
  }
};
