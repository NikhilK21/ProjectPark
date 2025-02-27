const mongoose = require("mongoose");

const ParkingSpotSchema = new mongoose.Schema({
  name: String,
  latitude: Number,
  longitude: Number,
  fare: Number,
  amenities: [String], // Example: ["CCTV", "EV Charger"]
});

const ParkingSpot = mongoose.model("ParkingSpot", ParkingSpotSchema);

module.exports = ParkingSpot;
