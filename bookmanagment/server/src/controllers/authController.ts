import { Request, Response } from "express";
import User from "../models/User";
import { signToken } from "../services/jwtService";
import { generateOTP, getOTPExpiry } from "../services/otpService";

// Register
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password required",
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    if (role === "admin") {
      const existingAdmin = await User.findOne({ role: "admin" });
      if (existingAdmin) {
        return res.status(403).json({
          success: false,
          message: "An admin already exists. Only one admin is allowed.",
        });
      }
    }

    const user = new User({ name, email, password, role: role || "user" });
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Signup successful. Please login with your credentials.",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error("Register error:", err.message || err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Login with Generate Otp
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = getOTPExpiry();
    await user.save();

    return res.json({
      success: true,
      message: "OTP sent to your email/phone",
      data: {
        email: user.email,
        otp: process.env.NODE_ENV === "development" ? otp : undefined,
      },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Verify OTP & Issue JWT
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (!user.otpExpiry || new Date() > user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = signToken({ id: user._id, role: user.role });

    return res.json({
      success: true,
      message: "OTP verified successfully",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err: any) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
