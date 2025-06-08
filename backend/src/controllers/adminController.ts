import type { Request, Response } from "express";
import Admin from "../models/Admin";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken";
import generateUniqueId from "../utils/generateUniqueID";

// Admin Registration
const registerAdminController = async (req: Request, res: Response) => {
  const { name, email, mobile, password } = req.body;

  if (!name || !email || !mobile || !password) {
    return res
      .status(400)
      .json({ message: "All fields are required", success: false });
  }

  // Check if admin exists in the database
  const adminExists = await Admin.findOne({ email });

  if (adminExists) {
    return res
      .status(400)
      .json({ message: "Admin already exists", success: false });
  }

  const id = await generateUniqueId(name, email, mobile);
  // Create a new admin
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({
      name,
      email,
      mobile,
      password: hashedPassword,
      id,
    });

    await admin.save();

    res
      .status(201)
      .json({ message: "Admin registered successfully", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering Admin", error, success: false });
  }
};

// Admin Login
const loginAdminController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "All fields are required", success: false });
  }

  try {
    // Check if admin exists in the database
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }

    const token = generateToken(admin._id.toString());

    admin.token = token;

    await admin.save();

    res.status(200).json({
      message: "Admin logged in successfully",
      success: true,
      data: {
        name: admin.name,
        email: admin.email,
        mobile: admin.mobile,
        token: admin.token,
        id: admin.id,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during login", error, success: false });
  }
};

// get all admins
const getAllAdminsController = async (req: Request, res: Response) => {
  try {
    const admins = await Admin.find({}).select("-password -token");
    res.status(200).json({ message: "Admins fetched successfully", admins });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching admins",
      error: (error as Error).message,
    });
  }
};

// Admin update
const updateAdminPasswordController = async (req: Request, res: Response) => {
  const { passwordNew, passwordOld } = req.body;
  const token = req.headers.token;

  if (! passwordNew || !passwordOld) {
    return res
      .status(400)
      .json({ message: "All fields are required", success: false });
  }

  try {
    // Check if admin exists in the database
    const adminExists = await Admin.findOne({ token });

    if (!adminExists) {
      return res
        .status(400)
        .json({ message: "Admin does not exists", success: false });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(passwordOld, adminExists.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }

    const hashedPassword = await bcrypt.hash(passwordNew, 10);

    await Admin.updateOne(
      { token },
      {
        password: hashedPassword,
      }
    );

    res.status(200).json({ message: "Admin's password is  updated", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Admin's password", error, success: false });
  }
};

export {
  registerAdminController,
  loginAdminController,
  getAllAdminsController,
  updateAdminPasswordController,
};
