const express = require("express");
const ParkingSpot = require("../models/ParkingSpot");
const mongoose =  require("mongoose");
const router = express.Router();

// ✅ Add a new parking spot (Admin Only)
router.post("/", async (req, res) => {
    try {
      const { name, latitude, longitude, fare, amenities } = req.body;
  
      if (isNaN(longitude) || longitude < -180 || longitude > 180) {
        return res.status(400).json({ message: "Invalid longitude format" });
      }
      

      if (!name || !latitude || !longitude || !fare) {
        return res.status(400).json({ message: "Please fill all required fields" });
      }
  
      const newSpot = new ParkingSpot({
        name,
        latitude,
        longitude,
        fare,
        amenities,
      });
  
      await newSpot.save();
      res.status(201).json({ message: "Parking spot added successfully", newSpot });
    } catch (error) {
      res.status(500).json({ message: "Error adding parking spot", error });
    }
  });

// ✅ Get all parking spots
router.get("/", async (req, res) => {
  try {
    const parkingSpots = await ParkingSpot.find();
    res.status(200).json(parkingSpots);
  } catch (error) {
    res.status(500).json({ message: "Error fetching parking spots", error });
  }
});

// ✅ Get parking spots near a location
router.get("/nearby", async (req, res) => {

    console.log("Query Params:", req.query);
console.log("Latitude (before parsing):", req.query.latitude);
console.log("Longitude (before parsing):", req.query.longitude);

  try {
    const lat = parseFloat(req.query.lat);
const lng = parseFloat(req.query.lng);

if (!req.query.lat || !req.query.lng || isNaN(lat) || isNaN(lng)) {
  return res.status(400).json({ message: "Invalid latitude or longitude" });
}

console.log("Parsed Latitude:", lat, "Parsed Longitude:", lng);


const nearbySpots = await ParkingSpot.find({
    latitude: { $gte: parseFloat((lat - 0.05).toFixed(6)), $lte: parseFloat((lat + 0.05).toFixed(6)) },
    longitude: { $gte: parseFloat((lng - 0.05).toFixed(6)), $lte: parseFloat((lng + 0.05).toFixed(6)) },
  });
  

    res.status(200).json(nearbySpots);
  } catch (error) {
    res.status(500).json({ message: "Error fetching nearby parking spots", error });
  }
});

// ✅ Get details of a specific parking spot
router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params; // ✅ Extract ID from request parameters
  
      console.log("🚀 Request received for Parking Spot ID:", id); // Debugging
  
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
      res.status(200).json(parkingSpot);
    } catch (error) {
      console.error("❌ Error fetching parking spot:", error);
      res.status(500).json({ message: "Error fetching parking spot", error: error.message });
    }
  });

module.exports = router;
