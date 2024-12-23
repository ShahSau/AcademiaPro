import AcademicYear from "../models/AcademicYear";
import Admin from "../models/Admin";
import type { Request, Response } from "express";

// create Academic Year
const createAcademicYear = async (req: Request, res: Response) => {
  const { name, fromYear, toYear, adminEmail } = req.body;
  //check name exists
  const createAcademicYearFound = await AcademicYear.findOne({
    name,
  });
  if (createAcademicYearFound) {
    throw new Error("Academic year already exists");
  }

  //check admin exists
  const admin = await Admin.findOne({ email: adminEmail });

  if (!admin) {
    throw new Error("Admin not found");
  }

  const academicYear = new AcademicYear({
    name,
    fromYear,
    toYear,
    createdBy: admin._id,
  });

  await academicYear.save();

  res.status(201).json({
    status: "success",
    message: "Academic year created successfully",
    data: academicYear,
  });
};

// get all Academic Years
const getAcademicYears = async (req: Request, res: Response) => {
  const academicYears = await AcademicYear.find();

  res.status(201).json({
    status: "success",
    message: "Academic years fetched successfully",
    data: academicYears,
  });
};

// get single Academic Year
const getAcademicYear = async (req: Request, res: Response) => {
  const academicYears = await AcademicYear.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Academic years fetched successfully",
    data: academicYears,
  });
};

// update Academic Year
const updateAcademicYear = async (req: Request, res: Response) => {
  const { name, fromYear, toYear, adminEmail } = req.body;
  //check name exists
  const createAcademicYearFound = await AcademicYear.findOne({ name });
  if (createAcademicYearFound) {
    throw new Error("Academic year already exists");
  }

  //check admin exists
  const admin = await Admin.findOne({ email: adminEmail });

  if (!admin) {
    throw new Error("Admin not found");
  }
  const academicYear = await AcademicYear.findByIdAndUpdate(
    req.params.id,
    {
      name,
      fromYear,
      toYear,
      createdBy: admin._id,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Academic years updated successfully",
    data: academicYear,
  });
};

// delete Academic Year
const deleteAcademicYear = async (req: Request, res: Response) => {
  await AcademicYear.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Academic year deleted successfully",
  });
};

export {
  createAcademicYear,
  getAcademicYears,
  getAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
};
