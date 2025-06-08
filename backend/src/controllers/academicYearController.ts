import AcademicYear from "../models/AcademicYear";
import Admin from "../models/Admin";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import Student from "../models/Student";
import Teacher from "../models/Teacher";

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
      createdBy: admin._id,
      yearId: uuidv4().replace(/-/g, "").slice(0, 18),
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
      message: (error as Error).message,
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
      message: (error as Error).message,
    });
  }
};

// get single Academic Year
const getAcademicYear = async (req: Request, res: Response) => {
  try {
    const academicYears = await AcademicYear.findOne({ yearId: req.params.id });

    res.status(201).json({
      status: "success",
      message: "Academic years fetched successfully",
      data: academicYears,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// update Academic Year
const updateAcademicYear = async (req: Request, res: Response) => {
  try {
    const { name, fromYear, toYear } = req.body;
    //check name exists
    const createAcademicYearFound = await AcademicYear.findOne({
      yearId: req.params.id,
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
      { yearId: req.params.id },
      {
        name,
        fromYear,
        toYear,
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
      message: (error as Error).message,
    });
  }
};

// delete Academic Year
const deleteAcademicYear = async (req: Request, res: Response) => {
  try {
    const academicYear = await AcademicYear.findOne({ yearId: req.params.id });

    if (!academicYear) {
      throw new Error("Academic year not found");
    }

    await academicYear.deleteOne({ yearId: req.params.id });

    res.status(200).json({
      status: "success",
      message: "Academic year deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Add students to an academic year
const addStudentsToAcademicYear = async (req: Request, res: Response) => {
  try {
    const { studentIds } = req.body;
    const academicYear = await AcademicYear.findOne({ yearId: req.params.id });
    if (!academicYear) {
      throw new Error("Academic year not found");
    }
    const students = await Student.find({ _id: { $in: studentIds } });
    if (students.length !== studentIds.length) {
      throw new Error("Some students not found");
    }
    academicYear.students.push(...students.map((student) => student._id));
    await academicYear.save();
    res.status(200).json({
      status: "success",
      message: "Students added to academic year successfully",
      data: academicYear,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Add teachers to an academic year
const addTeachersToAcademicYear = async (req: Request, res: Response) => {
  try {
    const { teacherIds } = req.body;
    const academicYear = await AcademicYear.findOne({ yearId: req.params.id });
    if (!academicYear) {
      throw new Error("Academic year not found");
    }
    const teachers = await Teacher.find({ _id: { $in: teacherIds } });
    if (teachers.length !== teacherIds.length) {
      throw new Error("Some teachers not found");
    }
    academicYear.teachers.push(...teachers.map((teacher) => teacher._id));
    await academicYear.save();
    res.status(200).json({
      status: "success",
      message: "Teachers added to academic year successfully",
      data: academicYear,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// get all students in an academic year
const getStudentsInAcademicYear = async (req: Request, res: Response) => {
  try {
    const academicYear = await AcademicYear.findOne({
      yearId: req.params.id,
    }).populate("students");
    if (!academicYear) {
      throw new Error("Academic year not found");
    }
    res.status(200).json({
      status: "success",
      message: "Students in academic year fetched successfully",
      data: academicYear.students,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};
// get all teachers in an academic year
const getTeachersInAcademicYear = async (req: Request, res: Response) => {
  try {
    const academicYear = await AcademicYear.findOne({
      yearId: req.params.id,
    }).populate("teachers");
    if (!academicYear) {
      throw new Error("Academic year not found");
    }
    res.status(200).json({
      status: "success",
      message: "Teachers in academic year fetched successfully",
      data: academicYear.teachers,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

export {
  createAcademicYear,
  getAcademicYears,
  getAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
  addStudentsToAcademicYear,
  addTeachersToAcademicYear,
  getStudentsInAcademicYear,
  getTeachersInAcademicYear,
};
