
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
 
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    
    const bearerToken = token.startsWith("Bearer ")
      ? token.slice(7).trim()
      : token;

    
    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);

    
    req.user = decoded;
    next();
  } catch (err) {
   
    console.error("Token verification error:", err);

   
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = auth;
