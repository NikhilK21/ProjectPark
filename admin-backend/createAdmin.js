const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Import Admin model
const Admin = require("./models/Admin");

// Connect to MongoDB
mongoose.connect("mongodb+srv://nikhilkumargdsc:T0sVG5w1xAsDKjqf@cluster0.te0ps.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = new Admin({ username: "admin", password: hashedPassword });

    await admin.save();
    console.log("Admin created successfully!");
  } catch (err) {
    console.error("Error creating admin:", err);
  } finally {
    mongoose.disconnect();
  }
};

// Run the function
createAdmin();
