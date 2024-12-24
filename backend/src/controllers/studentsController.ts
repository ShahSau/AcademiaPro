// import generateToken from "../../utils/generateToken";
// import { hashPassword, isPassMatched } from "../../utils/helpers";
//
import AcademicTerm from "../models/AcademicTerm";
import Admin from "../models/Admin";
import ClassLevel from "../models/ClassLevel";
import Exam from "../models/Exam";
import ExamResult from "../models/ExamResults";
import Question from "../models/Questions";
import Student from "../models/Student";
import generateToken from "../utils/generateToken";
import { hashPassword, isPassMatched } from "../utils/helpers";
import type { Request, Response } from "express";

const registerStudentByAdmin = async (req: Request, res: Response) => {
  const { name, email, password, adminEmail } = req.body;
  //find the admin
  const adminFound = await Admin.findOne({ email: adminEmail });
  if (!adminFound) {
    throw new Error("Admin not found");
  }

  //check if teacher already exists
  const student = await Student.findOne({ email });
  if (student) {
    throw new Error("Student already employed");
  }
  //Hash password
  const hashedPassword = await hashPassword(password);
  // create
  const studentRegistered = await Student.create({
    name,
    email,
    password: hashedPassword,
  });
  //push teacher into admin
  adminFound.students.push(studentRegistered.id);
  await adminFound.save();
  //send student data
  res.status(201).json({
    status: "success",
    message: "Student registered successfully",
    data: studentRegistered,
  });
};

const loginStudent = async (req: Request, res: Response) => {
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
  } else {
    res.status(200).json({
      status: "success",
      message: "Student logged in successfully",
      data: generateToken((student!._id as unknown as string).toString()),
    });
  }
};

const getStudentProfile = async (req: Request, res: Response) => {
  const studentEmail = req.body.email;
  const student = await Student.findOne({ email: studentEmail })
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
    isExpeled: student?.isExpeled,
    studentId: student?.studentId,
    prefectName: student?.prefectName,
  };

  //get student exam results
  const examResults = student.examResults;
  //current exam
  const currentExamResult = examResults[examResults.length - 1];

  //check if exam is published
  const isPublished =
    await ExamResult.findById(currentExamResult).select("isPublished");

  //send response
  res.status(200).json({
    status: "success",
    data: {
      studentProfile,
      currentExamResult: isPublished ? currentExamResult : [],
    },
    message: "Student Profile fetched  successfully",
  });
};

const getAllStudentsByAdmin = async (req: Request, res: Response) => {
  const students = await Student.find();
  res.status(200).json({
    status: "success",
    message: "Students fetched successfully",
    data: students,
  });
};

const getStudentByAdmin = async (req: Request, res: Response) => {
  const studentID = req.params.studentID;
  //find the student
  const student = await Student.findById(studentID);
  if (!student) {
    throw new Error("Student not found");
  }
  res.status(200).json({
    status: "success",
    message: "Student fetched successfully",
    data: student,
  });
};

const updateStudentProfile = async (req: Request, res: Response) => {
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
};

const adminUpdateStudent = async (req: Request, res: Response) => {
  const {
    classLevels,
    academicYear,
    program,
    name,
    email,
    prefectName,
    isSuspended,
    isExpeled,
  } = req.body;

  //find the student by id
  const studentFound = await Student.findById(req.params.studentID);
  if (!studentFound) {
    throw new Error("Student not found");
  }

  //update
  const studentUpdated = await Student.findByIdAndUpdate(
    req.params.studentID,
    {
      $set: {
        name,
        email,
        academicYear,
        program,
        prefectName,
        isSuspended,
        isExpeled,
      },
      $addToSet: {
        classLevels,
      },
    },
    {
      new: true,
    }
  );
  //send response
  res.status(200).json({
    status: "success",
    data: studentUpdated,
    message: "Student updated successfully",
  });
};

const writeExam = async (req: Request, res: Response) => {
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
  if (studentFound.isExpeled || studentFound.isSuspended) {
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
    studentFound.examResults.push(examResults?._id);
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
      studentFound.classLevels.push("Level 200");
      studentFound.currentClassLevel = "Level 200";
      await studentFound.save();
    }

    //promote student to level 300
    if (
      academicTerm?.name === "2nd term" &&
      status === "Pass" &&
      studentFound?.currentClassLevel === "Level 200"
    ) {
      studentFound.classLevels.push("Level 300");
      studentFound.currentClassLevel = "Level 300";
      await studentFound.save();
    }

    //promote student to level 400
    if (
      academicTerm?.name === "3rd term" &&
      status === "Pass" &&
      studentFound?.currentClassLevel === "Level 300"
    ) {
      studentFound.classLevels.push("Level 400");
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
