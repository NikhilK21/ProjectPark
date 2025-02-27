import { useState, useEffect } from "react";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import axios from "axios";

function EditParking({ open, handleClose, parkingSpot, refreshParkingSpots }) {
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    fare: "",
    amenities: "",
  });

  useEffect(() => {
    if (parkingSpot) {
      setFormData({
        name: parkingSpot.name,
        latitude: parkingSpot.latitude,
        longitude: parkingSpot.longitude,
        fare: parkingSpot.fare,
        amenities: parkingSpot.amenities.join(", "),
      });
    }
  }, [parkingSpot]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/parking/${parkingSpot._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      handleClose();
      refreshParkingSpots();
    } catch (err) {
      alert("Failed to update parking spot!");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Parking Spot</DialogTitle>
      <DialogContent>
        <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} margin="normal" />
        <TextField fullWidth label="Latitude" name="latitude" value={formData.latitude} onChange={handleChange} margin="normal" />
        <TextField fullWidth label="Longitude" name="longitude" value={formData.longitude} onChange={handleChange} margin="normal" />
        <TextField fullWidth label="Fare" name="fare" type="number" value={formData.fare} onChange={handleChange} margin="normal" />
        <TextField fullWidth label="Amenities (comma-separated)" name="amenities" value={formData.amenities} onChange={handleChange} margin="normal" />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">Update</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditParking;
