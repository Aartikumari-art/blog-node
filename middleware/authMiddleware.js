const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const {userModel} = require("../model/UserModel");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
   

    const user = await userModel.findById(decoded.id).select("-password");
  

    if (!user) throw new Error("User not found");

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT error:", err.message);
   ;
    return res.status(401).json({ message: err.message });
  }
};

module.exports = authMiddleware;
