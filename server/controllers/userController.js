import User from "../models/userModel.js";
import fetch from "node-fetch";
import { generateToken } from "../utils/generate.token.js";

// 📌 Register user with email + auto-location
export const registerUser = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    let locationData = {};
    try {
      const response = await fetch(`http://ip-api.com/json/${ip}`);
      locationData = await response.json();
    } catch (error) {
      console.log("❌ IP lookup failed:", error);
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        isGuest: false,
        ipAddress: {
          ip,
          country: locationData.country || "Unknown",
          city: locationData.city || "Unknown",
        },
      });
      await user.save();
    }

    // ✅ Generate Token & Set Cookie
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      email: user.email,
      ipAddress: user.ipAddress,
      isGuest: user.isGuest,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 Guest registration (no email, just IP + location)
export const registerGuest = async (req, res) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    let locationData = {};
    try {
      const response = await fetch(`http://ip-api.com/json/${ip}`);
      locationData = await response.json();
    } catch (error) {
      console.log("❌ IP lookup failed:", error);
    }

    const guest = new User({
      email: `guest_${Date.now()}@matessa.com`,
      isGuest: true,
      ipAddress: {
        ip,
        country: locationData.country || "Unknown",
        city: locationData.city || "Unknown",
      },
    });

    await guest.save();

    // ✅ Generate Token & Set Cookie
    generateToken(res, guest._id);

    res.json({
      _id: guest._id,
      email: guest.email,
      ipAddress: guest.ipAddress,
      isGuest: guest.isGuest,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 Logout
export const logoutUser = (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.json({ message: "Logged out" });
};
