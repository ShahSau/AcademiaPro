import AcademicTerm from "../models/AcademicTerm";
import Admin from "../models/Admin";
import Program from "../models/Program";
import Subject from "../models/Subject";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

// Create a new subject
const createSubject = async (req: Request, res: Response) => {
  try {
    const { name, description, academicTerm } = req.body;
    if (!name || !description || !academicTerm) {
      throw new Error("Please provide all required fields");
    }
    const token = req.headers.token;
    const programID = req.params.programID;

    const subjectFound = await Subject.findOne({ name });
    if (subjectFound) {
      throw new Error("Subject  already exists");
    }

    const admin = await Admin.findOne({ token });
    if (!admin) {
      throw new Error("Admin not found");
    }

    const academicTermFound = await AcademicTerm.findOne({
      name: academicTerm,
    });
    if (!academicTermFound) {
      throw new Error("Academic term not found");
    }

    const programFound = await Program.findOne({ programId: programID });
    if (!programFound) {
      throw new Error("Program not found");
    }

    const subjectCreated = await Subject.create({
      name,
      description,
      createdBy: admin._id,
      academicTerm: academicTermFound._id,
      programId: programFound._id,
      subjectId: uuidv4().replace(/-/g, "").slice(0, 24),
    });

    // Update the program with the new subject
    const updatedProgram = await Program.findOneAndUpdate(
      { _id: programFound._id },
      {
        $push: { subjects: subjectCreated._id },
      },
      {
        new: true,
      }
    );
    if (!updatedProgram) {
      throw new Error("Failed to update program with new subject");
    }

    res.status(201).json({
      status: "success",
      message: "Program created successfully",
      data: subjectCreated,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Get all subjects
const getSubjects = async (req: Request, res: Response) => {
  try {
    const classes = await Subject.find();
    res.status(201).json({
      status: "success",
      message: "Subjects fetched successfully",
      data: classes,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Get a single subject by ID
const getSubject = async (req: Request, res: Response) => {
  try {
    const subject = await Subject.findOne({ subjectId: req.params.id });
    res.status(201).json({
      status: "success",
      message: "Subject fetched successfully",
      data: subject,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

const updateSubject = async (req: Request, res: Response) => {
  try {
    const { name, description, duration } = req.body;
    const id = req.params.id;

    const subjectFound = await Subject.findOne({ subjectId: id });
    if (!subjectFound) {
      throw new Error("Subject dosenot exist");
    }

    const subject = await Subject.findOneAndUpdate(
      { subjectId: req.params.id },
      {
        name,
        description,
        duration,
      },
      {
        new: true,
      }
    );

    res.status(201).json({
      status: "success",
      message: "subject  updated successfully",
      data: subject,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

export { createSubject, getSubjects, getSubject, updateSubject };
