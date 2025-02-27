const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  
  if (!token) {
    return res.status(401).json({ msg: "Access Denied! No token provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.admin = decoded; // Store decoded token data (admin ID) in req.admin
    next();
  } catch (err) {
    res.status(403).json({ msg: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
