const mongoose = require("mongoose");

const ParkingSpotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  fare: { type: Number, required: true },
  amenities: { type: [String] } // Example: ["CCTV", "EV Charger", "Security"]
});

module.exports = mongoose.model("ParkingSpot", ParkingSpotSchema);
