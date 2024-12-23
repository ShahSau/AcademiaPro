import ExamResult from "../models/ExamResults";
import Student from "../models/Student";
import type { Request, Response } from "express";

const checkExamResults = async (req: Request, res: Response) => {
  const studentEmail = req.body.email;
  //find the student
  const studentFound = await Student.findOne({ email: studentEmail });
  if (!studentFound) {
    throw new Error("No Student Found");
  }
  //find the exam results
  const examResult = await ExamResult.findOne({
    studentID: studentFound?.studentId,
    _id: req.params.id,
  })
    .populate({
      path: "exam",
      populate: {
        path: "questions",
      },
    })
    .populate("classLevel")
    .populate("academicTerm")
    .populate("academicYear");
  //check if exam is published
  if (examResult?.isPublished === false) {
    throw new Error("Exam result is not available, check out later");
  }
  res.json({
    status: "success",
    message: "Exam result",
    data: examResult,
    student: studentFound,
  });
};

const getAllExamResults = async (req: Request, res: Response) => {
  const results = await ExamResult.find().select("exam").populate("exam");
  res.status(200).json({
    status: "success",
    message: "Exam Results fetched",
    data: results,
  });
};

const adminToggleExamResult = async (req: Request, res: Response) => {
  //find the exam Results
  const examResult = await ExamResult.findById(req.params.id);
  if (!examResult) {
    throw new Error("Exam result not foound");
  }
  const publishResult = await ExamResult.findByIdAndUpdate(
    req.params.id,
    {
      isPublished: req.body.publish,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    message: "Exam Results Updated",
    data: publishResult,
  });
};

export { checkExamResults, getAllExamResults, adminToggleExamResult };
