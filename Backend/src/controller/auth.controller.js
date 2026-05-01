import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

async function sendTokenResponse(user, res, message) {
  const token = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("token", token);

  res.status(200).json({
    message,
    success: true,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
    },
  });
}

export const RegisterController = async (req, res) => {
  const { email, contact, password, fullname, isSeller } = req.body;

  try {
    const existingUser = await userModel.findOne({
      $or: [{ email }, { contact }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email or contact already exists.", success: false });
    }

    const user = await userModel.create({
      email,
      contact,
      password,
      fullname,
      role: isSeller ? "seller" : "buyer",
    });

    await sendTokenResponse(user, res, "User registered successfully.");
  } catch (err) {
    return res.status(500).json({
      message: "Server",
      err
    });
  }
};


export const LoginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({
      $or: [{ email }],
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found.", success: false });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid password.", success: false });
    }

    await sendTokenResponse(user, res, "User logged in successfully.");
  } catch (err) {
    return res.status(500).json({
      message: "Server",
      err
    });
  }
}


export const GoogleCallback = async (req, res) => {
  try {
    const { id, displayName, emails } = req.user;
    const email = emails[0].value;

    // Find existing user or create a new one (upsert)
    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        email,
        fullname: displayName,
        googleId: id,
        needsRoleSetup: true,  // new Google users must pick buyer/seller
      });
    } else if (!user.googleId) {
      // Link Google ID to existing email account
      user.googleId = id;
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id },
      config.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // httpOnly so JS can't read it; SameSite=Lax works for same-site redirects
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });

    // Redirect based on role — mirrors what manual login does in the frontend
    if (user.needsRoleSetup) {
      // New Google user — go to home so RoleSetupModal can appear
      res.redirect("http://localhost:5173/");
    } else if (user.role === 'seller') {
      res.redirect("http://localhost:5173/seller/dashboard");
    } else {
      res.redirect("http://localhost:5173/");
    }
  } catch (err) {
    console.error("GoogleCallback error:", err);
    res.redirect("http://localhost:5173/login?error=google_failed");
  }
}

export const GetMe = async (req, res) => {
  return res.status(200).json({
    message: "User fetched Successfully",
    user: {
      id: req.user._id,
      email: req.user.email,
      contact: req.user.contact,
      fullname: req.user.fullname,
      role: req.user.role,
      needsRoleSetup: req.user.needsRoleSetup ?? false,
    },
    success: true,
  })
}

export const SetRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['buyer', 'seller'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be buyer or seller.', success: false });
    }
    const user = await userModel.findByIdAndUpdate(
      req.user._id,
      { role, needsRoleSetup: false },
      { new: true }
    );
    return res.status(200).json({
      message: 'Role updated successfully.',
      success: true,
      user: {
        id: user._id,
        email: user.email,
        contact: user.contact,
        fullname: user.fullname,
        role: user.role,
        needsRoleSetup: false,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', err });
  }
}

