import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Schema/User-login.js"; // Ensure correct import path
import authMiddleware from "../middleware/authMiddleware.js"; // Ensure correct import path

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Register Route
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Protected Admin Route
router.get("/admin", authMiddleware(["admin"]), (req, res) => {
  res.json({ message: "Welcome Admin!" });
});

// Protected Customer Route
router.get("/customer", authMiddleware(["customer", "admin"]), (req, res) => {
  res.json({ message: "Welcome Customer!" });
});

export default router; 
