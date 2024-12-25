import AcademicTerm from "../models/AcademicTerm";
import Admin from "../models/Admin";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

// create academic term
const createAcademicTerm = async (req: Request, res: Response) => {
  const { name, description, duration } = req.body;
  const token = req.headers.token;
  //check name exists
  const createAcademicTermFound = await AcademicTerm.findOne({ name });
  if (createAcademicTermFound) {
    throw new Error("Academic terms= already exists");
  }

  const admin = await Admin.findOne({ token });

  if (!admin) {
    throw new Error("Admin not found");
  }
  const academicTerm = new AcademicTerm({
    name,
    description,
    duration,
    createdBy: admin.id,
    id: uuidv4().replace(/-/g, "").slice(0, 14),
  });
  await academicTerm.save();

  res.status(201).json({
    status: "success",
    message: "Academic term created successfully",
    data: academicTerm,
  });
};

// get all academic terms
const getAcademicTerms = async (req: Request, res: Response) => {
  const academicTerms = await AcademicTerm.find({});

  res.status(201).json({
    status: "success",
    message: "Academic terms fetched successfully",
    data: academicTerms,
  });
};

// get academic term by id
const getAcademicTerm = async (req: Request, res: Response) => {
 
  const academicTerm = await AcademicTerm.findOne({ id: req.params.id });

  res.status(201).json({
    status: "success",
    message: "Academic term fetched successfully",
    data: academicTerm,
  });
};

// update academic term
const updateAcademicTerms = async (req: Request, res: Response) => {
  const { name, description, duration } = req.body;
  const admin = await Admin.findOne({ token: req.headers.token });

  if (!admin) {
    throw new Error("Admin not found");
  }

  const academicTerm = await AcademicTerm.findOne({id:req.params.id});

  if (!academicTerm) {
    throw new Error("Academic term not found");
  }

  academicTerm.name = name;
  academicTerm.description = description;
  academicTerm.duration = duration;
  academicTerm.createdBy = admin.id;

  await academicTerm.save();

  res.status(201).json({
    status: "success",
    message: "Academic term updated successfully",
    data: academicTerm,
  });
};

// delete academic term
const deleteAcademicTerm = async (req: Request, res: Response) => {
  const academicTerm = await AcademicTerm.findOne({id:req.params.id});

  if (!academicTerm) {
    throw new Error("Academic term not found");
  }

  await academicTerm.deleteOne({ id: req.params.id });

  res.status(200).json({
    status: "success",
    message: "Academic term deleted successfully",
  });
};

export {
  createAcademicTerm,
  getAcademicTerms,
  getAcademicTerm,
  updateAcademicTerms,
  deleteAcademicTerm,
};
