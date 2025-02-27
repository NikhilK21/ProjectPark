import { useState } from "react";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import axios from "axios";

function AddParking({ open, handleClose, refreshParkingSpots }) {
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    fare: "",
    amenities: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/parking", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      handleClose();
      refreshParkingSpots(); // Refresh the list after adding
    } catch (err) {
      alert("Failed to add parking spot!");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Parking Spot</DialogTitle>
      <DialogContent>
        <TextField fullWidth label="Name" name="name" onChange={handleChange} margin="normal" />
        <TextField fullWidth label="Latitude" name="latitude" onChange={handleChange} margin="normal" />
        <TextField fullWidth label="Longitude" name="longitude" onChange={handleChange} margin="normal" />
        <TextField fullWidth label="Fare" name="fare" type="number" onChange={handleChange} margin="normal" />
        <TextField fullWidth label="Amenities (comma-separated)" name="amenities" onChange={handleChange} margin="normal" />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">Add</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddParking;
