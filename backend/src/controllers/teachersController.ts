import type { Request, Response } from "express";
import Admin from "../models/Admin";
import Teacher from "../models/Teacher";
import generateToken from "../utils/generateToken";
import { hashPassword, isPassMatched } from "../utils/helpers";

const adminRegisterTeacher = async (req: Request, res: Response) => {
  const { name, email, password, adminEmail } = req.body;
  //find the admin
  const adminFound = await Admin.findOne({ email: adminEmail });
  if (!adminFound) {
    throw new Error("Admin not found");
  }
  //check if teacher already exists
  const teacher = await Teacher.findOne({ email });
  if (teacher) {
    throw new Error("Teacher already employed");
  }
  //Hash password
  const hashedPassword = await hashPassword(password);
  // create
  const teacherCreated = await Teacher.create({
    name,
    email,
    password: hashedPassword,
  });
  //push teacher into admin
  adminFound.teachers.push(teacherCreated?._id);
  await adminFound.save();
  //send teacher data
  res.status(201).json({
    status: "success",
    message: "Teacher registered successfully",
    data: teacherCreated,
  });
};

const loginTeacher = async (req: Request, res: Response) => {
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
  } else {
    res.status(200).json({
      status: "success",
      message: "Teacher logged in successfully",
      data: generateToken(teacher?.teacherId),
    });
  }
};

const getAllTeachersAdmin = async (req: Request, res: Response) => {
  const teachers = await Teacher.find();
  res.status(200).json({
    status: "success",
    message: "Teachers fetched successfully",
    data: teachers,
  });
};

const getTeacherByAdmin = async (req: Request, res: Response) => {
  const teacher = await Teacher.findById(req.params.teacherID);
  if (!teacher) {
    throw new Error("Teacher not found");
  }
  res.status(200).json({
    status: "success",
    data: teacher,
    message: "Teacher fetched successfully",
  });
};

const getTeacherProfile = async (req: Request, res: Response) => {
  const teacherEmail = req.body.email;
  const teacher = await Teacher.findById(teacherEmail).select(
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
};

const teacherUpdateProfile = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;
  //if email is taken
  const emailExist = await Teacher.findOne({ email });
  if (emailExist) {
    throw new Error("This email is taken/exist");
  }

  //hash password
  //check if user is updating password

  if (password) {
    //update
    const teacher = await Teacher.findByIdAndUpdate(
      req.userAuth._id,
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
    const teacher = await Teacher.findByIdAndUpdate(
      req.userAuth._id,
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
};

const adminUpdateTeacher = async (req: Request, res: Response) => {
  const { program, classLevel, academicYear, subject } = req.body;
  //if email is taken
  const teacherFound = await Teacher.findById(req.params.teacherID);
  if (!teacherFound) {
    throw new Error("Teacher not found");
  }
  //Check if teacher is withdrawn
  if (teacherFound.employedCurrently === false) {
    throw new Error("Action denied, teacher is no longer employed");
  }
  //assign a program
  if (program) {
    teacherFound.program = program;
    await teacherFound.save();
    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Teacher updated successfully",
    });
  }

  //assign Class level
  if (classLevel) {
    teacherFound.classLevel = classLevel;
    await teacherFound.save();
    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Teacher updated successfully",
    });
  }

  //assign Academic year
  if (academicYear) {
    teacherFound.academicYear = academicYear;
    await teacherFound.save();
    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Teacher updated successfully",
    });
  }

  //assign subject
  if (subject) {
    teacherFound.subject = subject;
    await teacherFound.save();
    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Teacher updated successfully",
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
