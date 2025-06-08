import type { Request, Response } from "express";
import Admin from "../models/Admin";
import Teacher from "../models/Teacher";
import generateToken from "../utils/generateToken";
import { hashPassword, isPassMatched } from "../utils/helpers";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

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
    });

    adminFound.teachers.push(new mongoose.Types.ObjectId(teacherCreated.teacherId));
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
      message: "Admin logged in successfully",
      success: true,
      data: {
        name: teacher.name,
        email: teacher.email,
        token: teacher.token,
        id: teacher.id,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

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

const teacherUpdateProfile = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    const teacher = await Teacher.findOne({ token: req.headers.token });

    if (!teacher) {
      throw new Error("Teacher not found");
    }

    if (teacher.teacherId !== req.params.teacherID) {
      throw new Error("You are not authorized to perform this action");
    }

    if (password) {
      //update
      const teacher = await Teacher.findOneAndUpdate(
        { teacherId: req.params.teacherID },
        {
          email,
          password: await hashPassword(password),
          name,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).json({
        status: "success",
        data: teacher,
        message: "Teacher updated successfully",
      });
    } else {
      //update
      const teacher = await Teacher.findOneAndUpdate(
        { teacherId: req.params.teacherID },
        {
          email,
          name,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).json({
        status: "success",
        data: teacher,
        message: "Teacher updated successfully",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

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
