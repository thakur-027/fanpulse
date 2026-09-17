import { Router } from "express";
import User from "../models/User.model.js";
import { signToken, protect } from "../utils/auth.middleware.js";

const router = Router();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password, role });
    const token = signToken(user);
    res.cookie("token", token, cookieOptions);
    res.status(201).json({ id: user._id, name: user.name, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = signToken(user);
    res.cookie("token", token, cookieOptions);
    res.json({ id: user._id, name: user.name, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.json({ message: "Logged out" });
});

router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

export default router;
