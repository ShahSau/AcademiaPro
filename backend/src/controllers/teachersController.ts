import type { Request, Response } from "express";
import Admin from "../models/Admin";
import Teacher from "../models/Teacher";
import generateToken from "../utils/generateToken";
import { hashPassword, isPassMatched } from "../utils/helpers";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

// Admin registers a teacher
const adminRegisterTeacher = async (req: Request, res: Response) => {
  try {
    const { name, email, dateEmployed, password } = req.body;
    const token = req.headers.token;

    const adminFound = await Admin.findOne({ token });

    if (!adminFound) {
      throw new Error("Admin not found");
    }

    const teacher = await Teacher.findOne({ email });
    if (teacher) {
      throw new Error("Teacher already employed");
    }

    const hashedPassword = await hashPassword(password);

    const teacherCreated = await Teacher.create({
      name,
      email,
      dateEmployed,
      password: hashedPassword,
      teacherId: uuidv4().replace(/-/g, "").slice(0, 24),
      createdBy: adminFound._id,
    });

    adminFound.teachers.push(
      new mongoose.Types.ObjectId(teacherCreated.teacherId)
    );
    await adminFound.save();

    res.status(201).json({
      status: "success",
      message: "Teacher registered successfully",
      data: teacherCreated,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Teacher login
const loginTeacher = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    //find the  user
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.json({ message: "Invalid login crendentials" });
    }
    //verify the password
    const isMatched = await isPassMatched(password, teacher?.password);
    if (!isMatched) {
      return res.json({ message: "Invalid login crendentials" });
    }
    //generate token
    const token = generateToken(teacher.id);

    teacher.token = token;

    await teacher.save();

    res.status(200).json({
      message: "Teacher logged in successfully",
      success: true,
      data: {
        name: teacher.name,
        email: teacher.email,
        token: teacher.token,
        id: teacher.id,
        teacherId: teacher.teacherId,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Get all teachers for admin with pagination
const getAllTeachersAdmin = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const teachers = await Teacher.find().skip(skip).limit(limit);
    const total = await Teacher.countDocuments();

    res.status(200).json({
      status: "success",
      message: "Teachers fetched successfully",
      data: teachers,
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

// Get a specific teacher by ID for admin
const getTeacherByAdmin = async (req: Request, res: Response) => {
  try {
    const teacher = await Teacher.findOne({ teacherId: req.params.teacherID });
    if (!teacher) {
      throw new Error("Teacher not found");
    }
    res.status(200).json({
      status: "success",
      data: teacher,
      message: "Teacher fetched successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Get your own teacher profile
const getTeacherProfile = async (req: Request, res: Response) => {
  try {
    const teacher = await Teacher.findOne({ token: req.headers.token }).select(
      "-password -createdAt -updatedAt"
    );
    if (!teacher) {
      throw new Error("Teacher not found");
    }
    res.status(200).json({
      status: "success",
      data: teacher,
      message: "Teacher Profile fetched  successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Update your own teacher profile
const teacherUpdateProfile = async (req: Request, res: Response) => {
  try {
    const { passwordNew, passwordOld } = req.body;

    const teacher = await Teacher.findOne({ token: req.headers.token });

    if (!teacher) {
      throw new Error("Teacher not found");
    }

    if (teacher.teacherId !== req.params.teacherID) {
      throw new Error("You are not authorized to perform this action");
    }

    if (teacher.isSuspended) {
      res.status(403).json({
        status: "error",
        message: "Teacher is suspended, cannot update profile",
      });
    }

    if (!passwordNew || !passwordOld) {
      throw new Error("Please provide both old and new passwords");
    }
    const isMatched = await isPassMatched(passwordOld, teacher.password);
    if (!isMatched) {
      throw new Error("Old password is incorrect");
    }
    if (passwordNew === passwordOld) {
      throw new Error("New password cannot be the same as old password");
    }

    const hashedPassword = await hashPassword(passwordNew);
    teacher.password = hashedPassword;
    await teacher.save();
    res.status(200).json({
      status: "success",
      data: teacher,
      message: "Teacher updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Admin updates a teacher's details
const adminUpdateTeacher = async (req: Request, res: Response) => {
  try {
    const { program, classLevel, academicYear, subject, suspend, employed } =
      req.body;

    const teacherFound = await Teacher.findOne({
      teacherId: req.params.teacherID,
    });
    if (!teacherFound) {
      throw new Error("Teacher not found");
    }

    if (teacherFound.employedCurrently === false) {
      throw new Error("Action denied, teacher is no longer employed");
    }

    if (employed !== undefined) {
      teacherFound.employedCurrently = employed;
    }

    if (suspend !== undefined) {
      teacherFound.isSuspended = suspend;
    }

    //assign a program
    if (program) {
      teacherFound.program = program;
    }

    //assign Class level
    if (classLevel) {
      teacherFound.classLevel = classLevel;
    }

    //assign Academic year
    if (academicYear) {
      teacherFound.academicYear = academicYear;
    }

    //assign subject
    if (subject) {
      teacherFound.subject = subject;
    }

    await teacherFound.save();
    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Teacher updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

export {
  adminRegisterTeacher,
  loginTeacher,
  getAllTeachersAdmin,
  getTeacherByAdmin,
  getTeacherProfile,
  teacherUpdateProfile,
  adminUpdateTeacher,
};
