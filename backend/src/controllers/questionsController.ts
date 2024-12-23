import Exam from "../models/Exam";
import Question from "../models/Questions";
import type { Request, Response } from "express";
import Teacher from "../models/Teacher";

const createQuestion = async (req: Request, res: Response) => {
  const {
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
    teacherEmail,
  } = req.body;
  //find the exam
  const examFound = await Exam.findById(req.params.examID);
  if (!examFound) {
    throw new Error("Exam not found");
  }
  //check if question
  const questionExists = await Question.findOne({ question });
  if (questionExists) {
    throw new Error("Question already exists");
  }
  //check if teacher exists
  const teacher = await Teacher.findOne({ email: teacherEmail });
  if (!teacher) {
    throw new Error("Teacher not found");
  }
  //create exam
  const questionCreated = await Question.create({
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
    createdBy: teacher._id,
  });
  //add the question into exam
  examFound.questions.push(questionCreated?._id);
  //save
  await examFound.save();
  res.status(201).json({
    status: "success",
    message: "Question created",
    data: questionCreated,
  });
};

const getQuestions = async (req: Request, res: Response) => {
  const questions = await Question.find();
  res.status(201).json({
    status: "success",
    message: "Question fetched successfully",
    data: questions,
  });
};

const getQuestion = async (req: Request, res: Response) => {
  const question = await Question.findById(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Question fetched successfully",
    data: question,
  });
};

const updateQuestion = async (req: Request, res: Response) => {
  const {
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
    teacherEmail,
  } = req.body;
  //check name exists
  const questionFound = await Question.findOne({ question });
  if (questionFound) {
    throw new Error("Question already exists");
  }
  const teacher = await Teacher.findOne({ email: teacherEmail });
  if (!teacher) {
    throw new Error("Teacher not found");
  }
  const program = await Question.findByIdAndUpdate(
    req.params.id,
    {
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      createdBy: teacher._id,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "Question  updated successfully",
    data: program,
  });
};

export { createQuestion, getQuestions, getQuestion, updateQuestion };
