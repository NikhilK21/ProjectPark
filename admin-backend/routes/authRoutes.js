const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin.js");

const router = express.Router();

// Admin Login Route
router.post("/login", async (req, res) => {  
  const { username, password } = req.body;

  try {
    // Check if admin exists
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ msg: "Admin not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid password" });

    // Generate JWT Token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Send token and admin details
    res.json({ 
      token,
      admin: { id: admin._id, username: admin.username } 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
