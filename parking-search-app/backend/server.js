const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const parkingRoutes = require("./routes/parkingRoutes");


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Failed:", err));
 
app.use("/api/parking", parkingRoutes);  

app.get('/', (req, res) => {
    res.send('Parking Search API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


