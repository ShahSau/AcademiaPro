import type { Request, Response } from "express";
import Admin from "../models/Admin";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken";
import Exam from "../models/Exam";
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

// Admin delete
const deleteAdminController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const token = req.headers.token;

  try {
    // Check if admin exists in the database
    const adminExists = await Admin.findOne({ id });

    if (!adminExists) {
      return res
        .status(400)
        .json({ message: "Eamil dosenot exists", success: false });
    }

    if (adminExists.token !== token) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    await Admin.deleteOne({
      id,
    });

    res.status(200).json({ message: "Admin deleted", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Admin", error, success: false });
  }
};

// Admin update
const updateAdminController = async (req: Request, res: Response) => {
  const { name, email, mobile, password } = req.body;
  const token = req.headers.token;

  if (!name || !email || !mobile || !password) {
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

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.updateOne(
      { token },
      {
        name: name,
        email: email,
        mobile: mobile,
        password: hashedPassword,
      }
    );

    res.status(200).json({ message: "Admin updated", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Admin", error, success: false });
  }
};

const changeResultStatus = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Exam ID is required" });
  }

  try {
    const exam = await Exam.findOne({ id });

    if (!exam) {
      return res.status(400).json({ message: "Exam does not exists" });
    }

    await Exam.updateOne(
      { id },
      {
        ...exam,
        resultPublished: !exam.resultPublished,
      }
    );

    res
      .status(200)
      .json({ message: "Exam results status updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error changing exam result status",
      error: (error as Error).message,
    });
  }
};

export {
  registerAdminController,
  loginAdminController,
  deleteAdminController,
  updateAdminController,
  changeResultStatus,
};
