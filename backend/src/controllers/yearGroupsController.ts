import Admin from "../models/Admin";
import Program from "../models/Program";
import Subject from "../models/Subject";
import YearGroup from "../models/YearGroup";
import type { Request, Response } from "express";

const createYearGroup = async (req: Request, res: Response) => {
  const { name, academicYear, adminEmail } = req.body;

  //check if exists
  const yeargroup = await YearGroup.findOne({ name });
  if (yeargroup) {
    throw new Error("Year Group/Graduation   already exists");
  }
  //admin
  const admin = await Admin.findOne({ email: adminEmail });
  if (!admin) {
    throw new Error("Admin not found");
  }
  //create
  const yearGroup = await YearGroup.create({
    name,
    academicYear,
    createdBy: admin._id,
  });
  //push to the program
  //find the admin
  if (!admin) {
    throw new Error("Admin not found");
  }
  //push year froup into admin
  admin.yearGroups.push(yearGroup._id);
  //save
  await admin.save();
  res.status(201).json({
    status: "success",
    message: "Year Group created successfully",
    data: yearGroup,
  });
};

const getYearGroups = async (req: Request, res: Response) => {
  const groups = await YearGroup.find();
  res.status(201).json({
    status: "success",
    message: "Year Groups fetched successfully",
    data: groups,
  });
};

const getYearGroup = async (req: Request, res: Response) => {
  const group = await YearGroup.findById(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Year Group fetched successfully",
    data: group,
  });
};

const updateYearGroup = async (req: Request, res: Response) => {
  const { name, academicYear, adminEmail } = req.body;
  //check name exists
  const yearGroupFound = await YearGroup.findOne({ name });
  if (yearGroupFound) {
    throw new Error("year Group already exists");
  }
  //admin
  const admin = await Admin.findOne({ email: adminEmail });
  if (!admin) {
    throw new Error("Admin not found");
  }
  const yearGroup = await YearGroup.findByIdAndUpdate(
    req.params.id,
    {
      name,
      academicYear,
      createdBy: admin._id,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "Year Group  updated successfully",
    data: yearGroup,
  });
};

const deleteYearGroup = async (req: Request, res: Response) => {
  await YearGroup.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Year Group deleted successfully",
  });
};

export {
  createYearGroup,
  getYearGroups,
  getYearGroup,
  updateYearGroup,
  deleteYearGroup,
};
