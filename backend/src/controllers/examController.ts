import AcademicTerm from "../models/AcademicTerm";
import ClassLevel from "../models/ClassLevel";
import Exam from "../models/Exam";
import Subject from "../models/Subject";
import Teacher from "../models/Teacher";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

// Create Exam
const createExam = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      subjectId,
      passMark,
      totalMark,
      academicTermId,
      duration,
      examDate,
      examTime,
      examStatus,
      classLevelId,
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

    //check if subject exists
    const subject = await Subject.findOne({ subjectId });
    if (!subject) {
      throw new Error("Subject not found");
    }

    //check if academic term exists
    const academicTerm = await AcademicTerm.findOne({ id:academicTermId });
    if (!academicTerm) {
      throw new Error("Academic term not found");
    }

    //check if class level exists
    const classLevel = await ClassLevel.findOne({ classId:classLevelId });
    if (!classLevel) {
      throw new Error("Class level not found");
    }

    const exam = new Exam({
      name,
      description,
      subject: subject._id,
      passMark,
      totalMark,
      academicTerm: academicTerm._id,
      duration,
      examDate,
      examTime,
      examStatus,
      classLevel: classLevel._id,
      createdBy: teacher._id,
      examId: uuidv4().replace(/-/g, "").slice(0, 18),
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
    const exam = await Exam.findOne({ examId: req.params.id })
      .populate("subject")
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
    const { name, description, duration, examDate, examTime, examStatus } =
      req.body;
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
        duration,
        examDate,
        examTime,
        examStatus,
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

// change exam status
const changeExamStatus = async (req: Request, res: Response) => {
  try {
    const exam = await Exam.findOne({ examId: req.params.id });
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    const updatedExam = await Exam.findOneAndUpdate(
      { examId: req.params.id },
      {
        examStatus: exam.examStatus === "pending" ? "live" : "pending",
      },
      { new: true }
    );
    res.status(200).json({
      message: "Exam status updated successfully",
      data: updatedExam,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating exam status",
      error: (error as Error).message,
    });
  }
};

export { createExam, getExams, getExam, updateExam, changeExamStatus };

