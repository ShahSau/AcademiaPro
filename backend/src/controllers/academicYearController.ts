import AcademicYear from "../models/AcademicYear";
import Admin from "../models/Admin";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

// create Academic Year
const createAcademicYear = async (req: Request, res: Response) => {
  try {
    const { name, fromYear, toYear } = req.body;
    //check name exists
    const createAcademicYearFound = await AcademicYear.findOne({
      name,
    });
    if (createAcademicYearFound) {
      throw new Error("Academic year already exists");
    }

    //check admin exists
    const admin = await Admin.findOne({ token: req.headers.token });

    if (!admin) {
      throw new Error("Admin not found");
    }

    const academicYear = new AcademicYear({
      name,
      fromYear,
      toYear,
      createdBy: admin.id,
      id: uuidv4().replace(/-/g, "").slice(0, 18),
    });

    await academicYear.save();

    res.status(201).json({
      status: "success",
      message: "Academic year created successfully",
      data: academicYear,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error,
    });
  }
};

// get all Academic Years
const getAcademicYears = async (req: Request, res: Response) => {
  try {
    const academicYears = await AcademicYear.find({});

    res.status(201).json({
      status: "success",
      message: "Academic years fetched successfully",
      data: academicYears,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error,
    });
  }
};

// get single Academic Year
const getAcademicYear = async (req: Request, res: Response) => {
  try {
    const academicYears = await AcademicYear.findOne({ id: req.params.id });

    res.status(201).json({
      status: "success",
      message: "Academic years fetched successfully",
      data: academicYears,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error,
    });
  }
};

// update Academic Year
const updateAcademicYear = async (req: Request, res: Response) => {
  try {
    const { name, fromYear, toYear } = req.body;
    //check name exists
    const createAcademicYearFound = await AcademicYear.findOne({
      id: req.params.id,
    });
    if (!createAcademicYearFound) {
      throw new Error("Academic year dosenot exists");
    }

    //check admin exists
    const admin = await Admin.findOne({ token: req.headers.token });

    if (!admin) {
      throw new Error("Admin not found");
    }
    const academicYear = await AcademicYear.findOneAndUpdate(
      { id: req.params.id },
      {
        name,
        fromYear,
        toYear,
        createdBy: admin.id,
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
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error,
    });
  }
};

// delete Academic Year
const deleteAcademicYear = async (req: Request, res: Response) => {
  try {
    const academicYear = await AcademicYear.findOne({ id: req.params.id });

    if (!academicYear) {
      throw new Error("Academic year not found");
    }

    await academicYear.deleteOne({ id: req.params.id });

    res.status(200).json({
      status: "success",
      message: "Academic year deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error,
    });
  }
};

export {
  createAcademicYear,
  getAcademicYears,
  getAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
};
