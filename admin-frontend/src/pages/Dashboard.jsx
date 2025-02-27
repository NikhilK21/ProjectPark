import { useEffect, useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import ParkingList from "../components/ParkingList";
import AddParking from "../components/AddParking";
import axios from "axios";

function Dashboard() {
  const [parkingSpots, setParkingSpots] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchParkingSpots = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/parking", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setParkingSpots(res.data);
    } catch (err) {
      alert("Failed to load parking spots");
    }
  };

  useEffect(() => {
    fetchParkingSpots();
  }, []);

  return (
    <Container>
      <Typography variant="h4">Admin Dashboard</Typography>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)} sx={{ marginBottom: 2 }}>
        Add Parking Spot
      </Button>

      <ParkingList parkingSpots={parkingSpots} refreshParkingSpots={fetchParkingSpots} />
      <AddParking open={open} handleClose={() => setOpen(false)} refreshParkingSpots={fetchParkingSpots} />
    </Container>
  );
}

export default Dashboard;
