import Admin from "../models/Admin";
import Program from "../models/Program";
import Subject from "../models/Subject";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const createSubject = async (req: Request, res: Response) => {
  try {
    const { name, description, academicTerm } = req.body;
    const token = req.headers.token;

    const programFound = await Program.findOne({ id: req.params.programID });
    if (!programFound) {
      throw new Error("Program  not found");
    }

    const subjectFound = await Subject.findOne({ name });
    if (subjectFound) {
      throw new Error("Subject  already exists");
    }

    const admin = await Admin.findOne({ token });
    if (!admin) {
      throw new Error("Admin not found");
    }

    const subjectCreated = await Subject.create({
      name,
      description,
      academicTerm,
      createdBy: admin.id,
      id: uuidv4().replace(/-/g, "").slice(0, 24),
      programId: programFound.id,
    });

    programFound.subjects.push(subjectCreated);

    await programFound.save();
    res.status(201).json({
      status: "success",
      message: "Program created successfully",
      data: subjectCreated,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error,
    });
  }
};

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
      message: error,
    });
  }
};

const getSubject = async (req: Request, res: Response) => {
  try {
    const subject = await Subject.findOne({ id: req.params.id });
    res.status(201).json({
      status: "success",
      message: "Subject fetched successfully",
      data: subject,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error,
    });
  }
};

const updateSubject = async (req: Request, res: Response) => {
  try {
    const { name, description, academicTerm, duration } = req.body;
    const token = req.headers.token;
    const id = req.params.id;

    //check name exists
    const subjectFound = await Subject.findOne({ id });
    if (!subjectFound) {
      throw new Error("Subject dosenot exist");
    }
    const admin = await Admin.findOne({ token });
    if (!admin) {
      throw new Error("Admin not found");
    }
    const programFound = await Program.findOne({ id: subjectFound.programId });

    if (!programFound) {
      throw new Error("Program not found");
    }

    const subjectProgram = programFound.subjects.filter(
      (subject) => subject.id !== req.params.id
    );

    subjectProgram.push({
      name,
      description,
      academicTerm,
      duration,
      createdBy: admin.id,
    });

    await Program.findOneAndUpdate(
      { id: subjectFound.programId },
      {
        subjects: subjectProgram,
      },
      {
        new: true,
      }
    );

    const subject = await Subject.findOneAndUpdate(
      { id: req.params.id },
      {
        name,
        description,
        academicTerm,
        duration,
        createdBy: admin.id,
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
      message: error,
    });
  }
};

export { createSubject, getSubjects, getSubject, updateSubject };
