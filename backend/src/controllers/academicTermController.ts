import AcademicTerm from "../models/AcademicTerm";
import Admin from "../models/Admin";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

// create academic term
const createAcademicTerm = async (req: Request, res: Response) => {
  try {
    const { name, description, duration } = req.body;
    const token = req.headers.token;
    //check name exists
    const createAcademicTermFound = await AcademicTerm.findOne({ name });
    if (createAcademicTermFound) {
      throw new Error("Academic terms already exists");
    }

    const admin = await Admin.findOne({ token });

    if (!admin) {
      throw new Error("Admin not found");
    }
    const academicTerm = new AcademicTerm({
      name,
      description,
      duration,
      createdBy: admin._id,
      termId: uuidv4().replace(/-/g, "").slice(0, 14),
    });

    await academicTerm.save();

    res.status(201).json({
      status: "success",
      message: "Academic term created successfully",
      data: academicTerm,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// get all academic terms
const getAcademicTerms = async (req: Request, res: Response) => {
  try {
    const academicTerms = await AcademicTerm.find({}).populate(
      "createdBy",
      "name email"
    );

    res.status(201).json({
      status: "success",
      message: "Academic terms fetched successfully",
      data: academicTerms,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// get academic term by id
const getAcademicTerm = async (req: Request, res: Response) => {
  try {
    const academicTerm = await AcademicTerm.findOne({
      _id: req.params.id,
    }).populate("createdBy", "name email");

    if (!academicTerm) {
      throw new Error("Academic term not found");
    }

    res.status(201).json({
      status: "success",
      message: "Academic term fetched successfully",
      data: academicTerm,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// update academic term
const updateAcademicTerms = async (req: Request, res: Response) => {
  try {
    const { name, description, duration } = req.body;
    const admin = await Admin.findOne({ token: req.headers.token });

    if (!admin) {
      throw new Error("Admin not found");
    }

    const academicTerm = await AcademicTerm.findOne({
      id: req.params.id,
    }).populate("createdBy", "name email");

    if (!academicTerm) {
      throw new Error("Academic term not found");
    }

    // Update only the fields that are provided
    if (name) {
      academicTerm.name = name;
    }
    if (description) {
      academicTerm.description = description;
    }
    if (duration) {
      academicTerm.duration = duration;
    }

    await academicTerm.save();

    res.status(201).json({
      status: "success",
      message: "Academic term updated successfully",
      data: academicTerm,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// delete academic term
const deleteAcademicTerm = async (req: Request, res: Response) => {
  try {
    const academicTerm = await AcademicTerm.findOne({ id: req.params.id });

    if (!academicTerm) {
      throw new Error("Academic term not found");
    }

    await academicTerm.deleteOne({ id: req.params.id });

    res.status(200).json({
      status: "success",
      message: "Academic term deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

export {
  createAcademicTerm,
  getAcademicTerms,
  getAcademicTerm,
  updateAcademicTerms,
  deleteAcademicTerm,
};
