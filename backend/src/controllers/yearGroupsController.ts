import AcademicYear from "../models/AcademicYear";
import Admin from "../models/Admin";
import YearGroup from "../models/YearGroup";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

// Create a new year group
const createYearGroup = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const token = req.headers.token;

    const yeargroup = await YearGroup.findOne({ name });

    if (yeargroup) {
      throw new Error("Year Group already exists");
    }

    const admin = await Admin.findOne({ token });

    if (!admin) {
      throw new Error("Admin not found");
    }

    const yearGroup = await YearGroup.create({
      name,
      createdBy: admin._id,
      yearGroupId: uuidv4().replace(/-/g, "").slice(0, 24),
    });

    admin.yearGroups.push(yearGroup._id);

    await admin.save();

    res.status(201).json({
      status: "success",
      message: "Year Group created successfully",
      data: yearGroup,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Get all year groups
const getYearGroups = async (req: Request, res: Response) => {
  try {
    const groups = await YearGroup.find();
    res.status(201).json({
      status: "success",
      message: "Year Groups fetched successfully",
      data: groups,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Get a specific year group by ID
const getYearGroup = async (req: Request, res: Response) => {
  try {
    const group = await YearGroup.findOne({ yearGroupId: req.params.id });
    res.status(201).json({
      status: "success",
      message: "Year Group fetched successfully",
      data: group,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

const updateYearGroup = async (req: Request, res: Response) => {
  const { name } = req.body;
  const token = req.headers.token;

  const yearGroupFound = await YearGroup.findOne({
    yearGroupId: req.params.id,
  });
  if (!yearGroupFound) {
    throw new Error("year Group doesn't  exists");
  }

  const admin = await Admin.findOne({ token });
  if (!admin) {
    throw new Error("Admin not found");
  }

  const yearGroup = await YearGroup.findOneAndUpdate(
    { yearGroupId: req.params.id },
    {
      name,
    },
    {
      new: true,
    }
  );

  if (!yearGroup) {
    throw new Error("Year Group not found");
  }

  res.status(201).json({
    status: "success",
    message: "Year Group updated successfully",
    data: yearGroup,
  });
};

// Delete a year group by ID
const deleteYearGroup = async (req: Request, res: Response) => {
  try {
    await YearGroup.findOneAndDelete({ yearGroupId: req.params.id });
    res.status(201).json({
      status: "success",
      message: "Year Group deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

const addAcademicYearToYearGroup = async (req: Request, res: Response) => {
  try {
    const { academicYearIds } = req.body;

    const yearGroup = await YearGroup.findOne({
      yearGroupId: req.params.id,
    });
    if (!yearGroup) {
      throw new Error("Year Group not found");
    }
    const academicYears = await AcademicYear.find({
      _id: { $in: academicYearIds },
    });
    if (academicYears.length !== academicYearIds.length) {
      throw new Error("Some academic years not found");
    }
    yearGroup.academicYear.push(...academicYears.map((ay) => ay._id));
    await yearGroup.save();
    res.status(200).json({
      status: "success",
      message: "Academic years added to year group successfully",
      data: yearGroup,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

export {
  createYearGroup,
  getYearGroups,
  getYearGroup,
  updateYearGroup,
  deleteYearGroup,
  addAcademicYearToYearGroup,
};
