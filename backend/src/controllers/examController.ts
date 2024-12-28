import Exam from "../models/Exam";
import Teacher from "../models/Teacher";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

// Create Exam
const createExam = async (req: Request, res: Response) => {
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
    resultPublished,
    questions,
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
    questions,
    academicYear,
    classLevel,
    resultPublished,
    createdBy: teacher.id,
    id: uuidv4().replace(/-/g, "").slice(0, 18),
  });

  const createdExam = await exam.save();
  res.status(201).json({
    status: "success",
    message: "Exam created successfully",
    data: createdExam,
  });
};

// Get Exams
const getExams = async (req: Request, res: Response) => {
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
};

// Get Exam
const getExam = async (req: Request, res: Response) => {
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
};

// Update Exam
const updatExam = async (req: Request, res: Response) => {
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
  const examFound = await Exam.findOne({ name });
  if (examFound) {
    throw new Error("Exam already exists");
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
};

export { createExam, getExams, getExam, updatExam };
