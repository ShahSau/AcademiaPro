import Exam from "../models/Exam";
import Teacher from "../models/Teacher";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

// Create Exam
const createExam = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      subject,
      program,
      academicTerm,
      duration,
      examDate,
      examTime,
      examType,
      academicYear,
      passMark,
      totalMark,
      classLevel,
      examStatus,
    } = req.body;
    //check name exists
    const examFound = await Exam.findOne({ name });
    if (examFound) {
      throw new Error("Exam already exists");
    }

    //check if teacher exists
    const teacher = await Teacher.findOne({ token: req.headers.token });
    if (!teacher) {
      throw new Error("Teacher not found");
    }

    const exam = new Exam({
      name,
      description,
      subject,
      program,
      passMark,
      totalMark,
      academicTerm,
      duration,
      examDate,
      examTime,
      examType,
      examStatus,
      academicYear,
      classLevel,
      createdBy: teacher.teacherId,
      id: uuidv4().replace(/-/g, "").slice(0, 18),
    });

    await exam.save();

    res.status(201).json({
      status: "success",
      message: "Exam created successfully",
      data: exam,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Get Exams
const getExams = async (req: Request, res: Response) => {
  try {
    const exams = await Exam.find({})
      .populate("subject")
      .populate("program")
      .populate("academicTerm")
      .populate("createdBy");
    res.status(200).json({
      status: "success",
      message: "Exams fetched successfully",
      data: exams,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Get Exam
const getExam = async (req: Request, res: Response) => {
  try {
    const exam = await Exam.findOne({ id: req.params.id })
      .populate("subject")
      .populate("program")
      .populate("academicTerm")
      .populate("createdBy");
    res.status(200).json({
      status: "success",
      message: "Exam fetched successfully",
      data: exam,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Update Exam
const updateExam = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      subject,
      program,
      academicTerm,
      duration,
      examDate,
      examTime,
      examType,
      academicYear,
      classLevel,
    } = req.body;
    //check name exists
    const examFound = await Exam.findOne({ id: req.params.id });

    if (!examFound) {
      throw new Error("Exam does not exist");
    }

    //check if teacher exists
    const teacher = await Teacher.findOne({ token: req.headers.token });

    if (!teacher) {
      throw new Error("Teacher not found");
    }

    const examUpdated = await Exam.findOneAndUpdate(
      { id: req.params.id },
      {
        name,
        description,
        subject,
        program,
        academicTerm,
        duration,
        examDate,
        examTime,
        examType,
        academicYear,
        classLevel,
        createdBy: teacher.id,
      },
      {
        new: true,
      }
    );

    res.status(201).json({
      status: "success",
      message: "Exam  updated successfully",
      data: examUpdated,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};


export { createExam, getExams, getExam, updateExam };
