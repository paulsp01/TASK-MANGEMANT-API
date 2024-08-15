
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // Check for Authorization header
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    // Extract the token from the "Bearer" prefix
    const bearerToken = token.startsWith("Bearer ")
      ? token.slice(7).trim()
      : token;

    // Verify the token
    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);

    // Attach the decoded user information to the request object
    req.user = decoded;
    next();
  } catch (err) {
    // Log the error (optional)
    console.error("Token verification error:", err);

    // Send a response with a 401 status code if the token is invalid
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = auth;
