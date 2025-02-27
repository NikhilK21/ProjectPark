import { useState } from "react";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";
import axios from "axios";
import EditParking from "./EditParking";

function ParkingList({ parkingSpots, refreshParkingSpots }) {
  const [editOpen, setEditOpen] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(null);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/parking/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshParkingSpots();
    } catch (err) {
      alert("Failed to delete parking spot!");
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        {parkingSpots.map((spot) => (
          <Grid item xs={12} sm={6} md={4} key={spot._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{spot.name}</Typography>
                <Typography>Fare: ₹{spot.fare}</Typography>
                <Typography>Amenities: {spot.amenities.join(", ")}</Typography>
                <Button variant="outlined" color="primary" onClick={() => { setSelectedSpot(spot); setEditOpen(true); }}>Edit</Button>
                <Button variant="contained" color="error" sx={{ marginLeft: 1 }} onClick={() => handleDelete(spot._id)}>
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedSpot && (
        <EditParking
          open={editOpen}
          handleClose={() => setEditOpen(false)}
          parkingSpot={selectedSpot}
          refreshParkingSpots={refreshParkingSpots}
        />
      )}
    </>
  );
}

export default ParkingList;
