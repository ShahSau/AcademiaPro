import AcademicYear from "../models/AcademicYear";
import Admin from "../models/Admin";
import YearGroup from "../models/YearGroup";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const createYearGroup = async (req: Request, res: Response) => {
  try {
    const { name, academicYear } = req.body;
    const token = req.headers.token;

    const yeargroup = await YearGroup.findOne({ name });
    if (yeargroup) {
      throw new Error("Year Group already exists");
    }

    const admin = await Admin.findOne({ token });

    if (!admin) {
      throw new Error("Admin not found");
    }

    const academicYearFound = await AcademicYear.findOne({
      name: academicYear,
    });

    if (!academicYearFound) {
      throw new Error("Academic Year not found");
    }

    const yearGroup = await YearGroup.create({
      name,
      academicYear: academicYearFound,
      createdBy: admin.id,
      id: uuidv4().replace(/-/g, "").slice(0, 24),
    });

    admin.yearGroups.push(yearGroup);

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

const getYearGroup = async (req: Request, res: Response) => {
  try {
    const group = await YearGroup.findOne({ id: req.params.id });
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
  const { name, academicYear } = req.body;
  const token = req.headers.token;

  const yearGroupFound = await YearGroup.findOne({ name });
  if (!yearGroupFound) {
    throw new Error("year Group dosenot  exists");
  }

  const admin = await Admin.findOne({ token });
  if (!admin) {
    throw new Error("Admin not found");
  }
  const academicYearFound = await AcademicYear.findOne({ name: academicYear });

  if (!academicYearFound) {
    throw new Error("Academic Year not found");
  }

  const yearGroup = await YearGroup.findOneAndUpdate(
    { id: req.params.id },
    {
      name,
      academicYear: academicYearFound,
      createdBy: admin.id,
    },
    {
      new: true,
    }
  );

  if (!yearGroup) {
    throw new Error("Year Group not found");
  }

  const groups = admin.yearGroups.map((group) => {
    if (group.id !== req.params.id) {
      return group;
    }
  });
  groups.push(yearGroup);

  admin.yearGroups = groups;

  await admin.save();

  res.status(201).json({
    status: "success",
    message: "Year Group updated successfully",
    data: yearGroup,
  });
};

const deleteYearGroup = async (req: Request, res: Response) => {
  try {
    await YearGroup.findOneAndDelete({ id: req.params.id });
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

export {
  createYearGroup,
  getYearGroups,
  getYearGroup,
  updateYearGroup,
  deleteYearGroup,
};
