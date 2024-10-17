// /middleware/authMiddleware.js
import jwt from "jsonwebtoken"

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  console.log("token is", token)
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
};

export default authMiddleware
