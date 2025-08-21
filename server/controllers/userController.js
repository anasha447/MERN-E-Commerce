import User from "../models/userModel.js";
import { generateToken } from "../utils/generate.token.js";
import sendEmail from "../utils/sendEmail.js";
import welcomeEmail from "../utils/emailTemplates/welcomeEmail.js";
import passwordResetEmail from "../utils/emailTemplates/passwordResetEmail.js";
import crypto from "crypto";

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email, isGuest: false });
  if (userExists) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const guestUser = await User.findOne({ email, isGuest: true });

  if (guestUser) {
    guestUser.name = name;
    guestUser.password = password;
    guestUser.isGuest = false;
    const updatedUser = await guestUser.save();
    try {
      await sendEmail({
        email: updatedUser.email,
        subject: "Welcome to MaTeesa!",
        html: welcomeEmail(updatedUser.name),
      });
    } catch (error) {
      console.error("Welcome email could not be sent.", error);
    }
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    const user = await User.create({ name, email, password });
    if (user) {
      try {
        await sendEmail({
          email: user.email,
          subject: "Welcome to MaTeesa!",
          html: welcomeEmail(user.name),
        });
      } catch (error) {
        console.error("Welcome email could not be sent.", error);
      }
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  }
};

const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/resetpassword/${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      html: passwordResetEmail(resetURL),
    });
    res.status(200).json({ message: "Token sent to email!" });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return res
      .status(500)
      .json({ message: "There was an error sending the email. Try again later!" });
  }
};

const resetPassword = async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Token is invalid or has expired" });
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
  });
};

const logoutUser = (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "Logged out successfully" });
};

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      phone: user.phone,
      address: user.address,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    if (req.body.address) {
      user.address = {
        street: req.body.address.street || user.address.street,
        city: req.body.address.city || user.address.city,
        postalCode: req.body.address.postalCode || user.address.postalCode,
        country: req.body.address.country || user.address.country,
      };
    }
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      phone: updatedUser.phone,
      address: updatedUser.address,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const getCart = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json(user.cart);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const updateCart = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.cart = req.body.cart;
    const updatedUser = await user.save();
    res.json(updatedUser.cart);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getCart,
  updateCart,
  forgotPassword,
  resetPassword,
};
