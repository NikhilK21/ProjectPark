const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const ParkingSpot = require("../models/ParkingSpot");

// Add a new parking spot (Admin Only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, latitude, longitude, fare, amenities } = req.body;
    const newSpot = new ParkingSpot({ name, latitude, longitude, fare, amenities });
    await newSpot.save();
    res.status(201).json(newSpot);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

// Update a parking spot (Admin Only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedSpot = await ParkingSpot.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSpot);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

// Delete a parking spot (Admin Only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await ParkingSpot.findByIdAndDelete(req.params.id);
    res.json({ msg: "Parking spot deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

// Get all parking spots
router.get("/", async (req, res) => {
  try {
    const spots = await ParkingSpot.find();
    res.json(spots);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

module.exports = router;
