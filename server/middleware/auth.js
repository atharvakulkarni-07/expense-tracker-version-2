// server/middleware/auth.js
import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  // Get token from Authorization header (format: "Bearer <token>")
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    // Verify token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user ID to req.user for use in routes
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    res.status(401).json({ error: "Token is not valid" });
  }
}
