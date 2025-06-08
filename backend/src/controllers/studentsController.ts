import mongoose from "mongoose";
import AcademicTerm from "../models/AcademicTerm";
import Admin from "../models/Admin";
import Exam from "../models/Exam";
import ExamResult from "../models/ExamResults";
import Question from "../models/Questions";
import Student from "../models/Student";
import generateToken from "../utils/generateToken";
import { hashPassword, isPassMatched } from "../utils/helpers";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const registerStudentByAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const token = req.headers.token;

    const adminFound = await Admin.findOne({ token });
    if (!adminFound) {
      throw new Error("Admin not found");
    }

    const student = await Student.findOne({ email });
    if (student) {
      throw new Error("Student already registered");
    }
    //Hash password
    const hashedPassword = await hashPassword(password);
    // create
    const studentRegistered = await Student.create({
      name,
      email,
      password: hashedPassword,
      id: uuidv4().replace(/-/g, "").slice(0, 24),
    });

    adminFound.students.push(studentRegistered.id);
    await adminFound.save();

    res.status(201).json({
      status: "success",
      message: "Student registered successfully",
      data: studentRegistered,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

const loginStudent = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    //find the  user
    const student = await Student.findOne({ email });
    if (!student) {
      return res.json({ message: "Invalid login crendentials" });
    }
    //verify the password
    const isMatched = await isPassMatched(password, student?.password);
    if (!isMatched) {
      return res.json({ message: "Invalid login crendentials" });
    }
    //generate token
    const token = generateToken(student.id);

    student.token = token;

    await student.save();

    res.status(200).json({
      message: "Admin logged in successfully",
      success: true,
      data: {
        name: student.name,
        email: student.email,
        token: student.token,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

const getStudentProfile = async (req: Request, res: Response) => {
  try {
    const student = await Student.findOne({ token: req.headers.token })
      .select("-password -createdAt -updatedAt")
      .populate({
        path: "examResults",
        model: "ExamResult",
      });
    if (!student) {
      throw new Error("Student not found");
    }
    //get student profile
    const studentProfile = {
      name: student?.name,
      email: student?.email,
      currentClassLevel: student?.currentClassLevel,
      program: student?.program,
      dateAtmitted: student?.dateAdmitted,
      isSuspended: student?.isSuspended,
      isExpeled: student?.isExpelled,
      studentId: student?.studentId,
      prefectName: student?.prefectName,
    };

    //get student exam results
    // const examResults = student.examResults;
    //current exam
    // const currentExamResult = examResults[examResults.length - 1];

    // toDo
    //add exam results to student profile
    // const isPublished =
    //   await ExamResult.findById(currentExamResult).select("isPublished");

    //send response
    res.status(200).json({
      status: "success",
      data: {
        studentProfile,
        // currentExamResult: isPublished ? currentExamResult : [],
        currentExamResult: [],
      },
      message: "Student Profile fetched  successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

const getAllStudentsByAdmin = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const students = await Student.find().skip(skip).limit(limit);
    const total = await Student.countDocuments();
    res.status(200).json({
      status: "success",
      message: "Students fetched successfully",
      data: students,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

const getStudentByAdmin = async (req: Request, res: Response) => {
  try {
    const student = await Student.findOne({ id: req.params.studentID });
    if (!student) {
      throw new Error("Student not found");
    }
    res.status(200).json({
      status: "success",
      data: student,
      message: "Student fetched successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

const updateStudentProfile = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    //if email is taken
    const emailExist = await Student.findOne({ email });
    if (!emailExist) {
      throw new Error("This email dosenot exists");
    }

    //hash password
    //check if user is updating password

    if (password) {
      //update
      const student = await Student.findOneAndUpdate(
        email,
        {
          email,
          password: await hashPassword(password),
        },
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).json({
        status: "success",
        data: student,
        message: "Student updated successfully",
      });
    } else {
      //update
      const student = await Student.findOneAndUpdate(
        email,
        {
          email,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).json({
        status: "success",
        data: student,
        message: "Student updated successfully",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

const adminUpdateStudent = async (req: Request, res: Response) => {
  try {
    const {
      classLevels,
      academicYear,
      program,
      Suspended,
      Expeled,
      Graduated,
    } = req.body;

    //find the student by id
    const studentFound = await Student.findOne({ id: req.params.studentID });
    if (!studentFound) {
      throw new Error("Student not found");
    }

    if (studentFound.isGraduated) {
      throw new Error("Student has graduated, you can't update the student");
    }

    if (Graduated !== undefined) {
      studentFound.isGraduated = Graduated;
    }
    if (Suspended !== undefined) {
      studentFound.isSuspended = Suspended;
    }
    if (Expeled !== undefined) {
      studentFound.isExpelled = Expeled;
    }

    if (classLevels) {
      studentFound.classLevels = classLevels;
    }
    if (academicYear) {
      studentFound.academicYear = academicYear;
    }
    if (program) {
      studentFound.program = program;
    }
    //send response
    await studentFound.save();
    res.status(200).json({
      status: "success",
      data: studentFound,
      message: "Student updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

const writeExam = async (req: Request, res: Response) => {
  try {
    const studentEmail = req.body.email;
    //get student
    const studentFound = await Student.findOne({ email: studentEmail });
    if (!studentFound) {
      throw new Error("Student not found");
    }
    //Get exam
    const examFound = await Exam.findById(req.params.examID)
      .populate({
        path: "questions",
        model: "Question",
      })
      .populate("academicTerm");

    if (!examFound) {
      throw new Error("Exam not found");
    }
    //get questions
    const questions = await Question.find({ exam: examFound?._id });
    //get students answers
    const studentAnswers = req.body.answers;

    //check if student answered all questions
    if (studentAnswers.length !== questions.length) {
      throw new Error("You have not answered all the questions");
    }

    // //check if student has already taken the exams
    const studentFoundInResults = await ExamResult.findOne({
      student: studentFound?._id,
    });
    if (studentFoundInResults) {
      throw new Error("You have already written this exam");
    }

    //check if student is suspende/withdrawn
    if (studentFound.isExpelled || studentFound.isSuspended) {
      throw new Error("You are suspended/withdrawn, you can't take this exam");
    }

    //Build report object
    let correctanswers = 0;
    //   let wrongAnswers = 0;
    let status = ""; //failed/passed
    let grade = 0;
    let remarks = "";
    let score = 0;
    let answeredQuestions = [];

    //check for answers
    for (let i = 0; i < questions.length; i++) {
      //find the question
      const question = questions[i];
      if (question.correctAnswer === studentAnswers[i]) {
        if (question.correctAnswer === studentAnswers[i]) {
          correctanswers++;
          score++;
          question.isCorrect = true;
        } else {
          //   wrongAnswers++;
        }
      }
      //calculate reports
      grade = (correctanswers / questions.length) * 100;
      answeredQuestions = questions.map((question) => {
        return {
          question: question.question,
          correctanswer: question.correctAnswer,
          isCorrect: question.isCorrect,
        };
      });

      //calculate status
      if (grade >= 50) {
        status = "Pass";
      } else {
        status = "Fail";
      }

      //Remarks
      if (grade >= 80) {
        remarks = "Excellent";
      } else if (grade >= 70) {
        remarks = "Very Good";
      } else if (grade >= 60) {
        remarks = "Good";
      } else if (grade >= 50) {
        remarks = "Fair";
      } else {
        remarks = "Poor";
      }

      //Generate Exam results
      const examResults = await ExamResult.create({
        studentID: studentFound?.studentId,
        exam: examFound?._id,
        grade,
        score,
        status,
        remarks,
        classLevel: examFound?.classLevel,
        academicTerm: examFound?.academicTerm,
        academicYear: examFound?.academicYear,
        answeredQuestions: answeredQuestions,
      });
      // //push the results into
      studentFound.examResults.push(examResults?.id);
      // //save
      await studentFound.save();

      //Promoting
      const academicTerm = await AcademicTerm.findById(examFound.academicTerm);
      //promote student to level 200
      if (
        academicTerm?.name === "1st term" &&
        status === "Pass" &&
        studentFound?.currentClassLevel === "Level 100"
      ) {
        studentFound.classLevels.push(new mongoose.Types.ObjectId("Level 200"));
        studentFound.currentClassLevel = "Level 200";
        await studentFound.save();
      }

      //promote student to level 300
      if (
        academicTerm?.name === "2nd term" &&
        status === "Pass" &&
        studentFound?.currentClassLevel === "Level 200"
      ) {
        studentFound.classLevels.push(new mongoose.Types.ObjectId("Level 300"));
        studentFound.currentClassLevel = "Level 300";
        await studentFound.save();
      }

      //promote student to level 400
      if (
        academicTerm?.name === "3rd term" &&
        status === "Pass" &&
        studentFound?.currentClassLevel === "Level 300"
      ) {
        studentFound.classLevels.push(new mongoose.Types.ObjectId("Level 400"));
        studentFound.currentClassLevel = "Level 400";
        await studentFound.save();
      }

      //promote student to graduate
      if (
        academicTerm?.name === "4th term" &&
        status === "Pass" &&
        studentFound?.currentClassLevel === "Level 400"
      ) {
        studentFound.isGraduated = true;
        studentFound.yearGraduated = new Date().toDateString();
        await studentFound.save();
      }

      res.status(200).json({
        status: "success",
        data: "You have submitted your exam. Check later for the results",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

export {
  registerStudentByAdmin,
  loginStudent,
  getStudentProfile,
  getAllStudentsByAdmin,
  getStudentByAdmin,
  updateStudentProfile,
  adminUpdateStudent,
  writeExam,
};
