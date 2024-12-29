import Exam from "../models/Exam";
import Question from "../models/Questions";
import type { Request, Response } from "express";
import Teacher from "../models/Teacher";
import { v4 as uuidv4 } from "uuid";
const createQuestion = async (req: Request, res: Response) => {
  try {
    const token = req.headers.token;
    const { question, optionA, optionB, optionC, optionD, correctAnswer } =
      req.body;

    const examFound = await Exam.findOne({ id: req.params.examId });
    if (!examFound) {
      throw new Error("Exam not found");
    }

    const questionExists = await Question.findOne({ question });
    if (questionExists) {
      throw new Error("Question already exists");
    }

    const teacher = await Teacher.findOne({ token });
    if (!teacher) {
      throw new Error("Teacher not found");
    }
    const questionId = uuidv4().replace(/-/g, "").slice(0, 24);

    const questionCreated = await Question.create({
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      createdBy: teacher.teacherId,
      id: questionId,
      examId: examFound.id,
    });

    examFound.questions.push(questionId);

    await examFound.save();

    res.status(201).json({
      status: "success",
      message: "Question created",
      data: questionCreated,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

const getQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await Question.find();
    res.status(201).json({
      status: "success",
      message: "Question fetched successfully",
      data: questions,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

const getQuestion = async (req: Request, res: Response) => {
  try {
    const question = await Question.findOne({ id: req.params.id });
    res.status(201).json({
      status: "success",
      message: "Question fetched successfully",
      data: question,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

const updateQuestion = async (req: Request, res: Response) => {
  try {
    const { question, optionA, optionB, optionC, optionD, correctAnswer } =
      req.body;

    const questionfound = await Question.findOne({ id: req.params.id });
    if (!questionfound) {
      throw new Error("Question not found");
    }
    const teacher = await Teacher.findOne({ token: req.headers.token });
    if (!teacher) {
      throw new Error("Teacher not found");
    }

    const program = await Question.findOneAndUpdate(
      { id: req.params.id },
      {
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        createdBy: teacher.teacherId,
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
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

export { createQuestion, getQuestions, getQuestion, updateQuestion };
