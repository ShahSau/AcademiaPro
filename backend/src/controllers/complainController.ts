import Complain from "../models/Complain";
import Admin from "../models/Admin";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";


// Create a new complain
const createComplain = async (req: Request, res: Response) => {
  try {
    const { title, details, accusing } = req.body;
    const token = req.headers.token;

    // Check if complain already exists
    const existingComplain = await Complain.findOne({ title });
    if (existingComplain) {
      throw new Error("Complain with this title already exists");
    }

    const admin = await Admin.findOne({ token });
    if (!admin) {
      throw new Error("Admin not found");
    }

    const complain = new Complain({
      title,
      details,
      createdBy: admin.id,
      accusing,
      status: "pending", // Default status
      id: uuidv4().replace(/-/g, "").slice(0, 14),
    });

    await complain.save();

    res.status(201).json({
      status: "success",
      message: "Complain created successfully",
      data: complain,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Get all complains
const getComplains = async (req: Request, res: Response) => {
  try {
    const complains = await Complain.find({}).populate("createdBy").populate("accusing");

    res.status(200).json({
      status: "success",
      message: "Complains fetched successfully",
      data: complains,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
}

// Get complain by ID
const getComplain = async (req: Request, res: Response) => {
  try {
    const complain = await Complain.findOne({ id: req.params.id }).populate("createdBy").populate("accusing");

    if (!complain) {
      return res.status(404).json({
        status: "error",
        message: "Complain not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Complain fetched successfully",
      data: complain,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
}

// Update complain status
const updateComplainStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const complain = await Complain.findOne({ id: req.params.id });

    if (!complain) {
      return res.status(404).json({
        status: "error",
        message: "Complain not found",
      });
    }

    complain.status = status;
    await complain.save();

    res.status(200).json({
      status: "success",
      message: "Complain status updated successfully",
      data: complain,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
}

export {
  createComplain,
  getComplains,
  getComplain,
  updateComplainStatus,
};