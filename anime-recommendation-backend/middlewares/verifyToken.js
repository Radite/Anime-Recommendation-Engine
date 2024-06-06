const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  // Get token from request headers
  const token = req.headers.authorization;

  // Log the token
  console.log("Received token:", token);

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Verify and decode the token
  jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Error verifying token:", err.message); // Log the error message
      return res.status(403).json({ message: "Failed to authenticate token" });
    }
    // Extract user ID from decoded token
    req.userId = decoded.userId;
    next();
  });
};
