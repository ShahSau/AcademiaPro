import type { Request, Response } from "express";
import Admin from "../models/Admin";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken";
import Teacher from "../models/Teacher";
import Exam from "../models/Exam";
import Student from "../models/Student";
import generateUniqueId from "../utils/generateUniqueID";

// Admin Registration
const registerAdminController = async (req: Request, res: Response) => {
  const { name, email, mobile, password } = req.body;

  if (!name || !email || !mobile || !password) {
    return res
      .status(400)
      .json({ message: "All fields are required", success: false });
  }

  // Check if admin exists in the database
  const adminExists = await Admin.findOne({ email });

  if (adminExists) {
    return res
      .status(400)
      .json({ message: "Admin already exists", success: false });
  }

  const id = await generateUniqueId(name, email, mobile);
  // Create a new admin
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({
      name,
      email,
      mobile,
      password: hashedPassword,
      id
    });

    await admin.save();

    res
      .status(201)
      .json({ message: "Admin registered successfully", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering Admin", error, success: false });
  }
};

// Admin Login
const loginAdminController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "All fields are required", success: false });
  }

  try {
    // Check if admin exists in the database
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }

    const token = generateToken(admin._id.toString());

    admin.token = token;

    await admin.save();

    res.status(200).json({
      message: "Admin logged in successfully",
      success: true,
      data: {
        name: admin.name,
        email: admin.email,
        mobile: admin.mobile,
        token: admin.token,
        id: admin.id
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during login", error, success: false });
  }
};

// Admin delete
const deleteAdminController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const token = req.headers.token;


  try {
    // Check if admin exists in the database
    const adminExists = await Admin.findOne({ id });

    if (!adminExists) {
      return res
        .status(400)
        .json({ message: "Eamil dosenot exists", success: false });
    }


    if (adminExists.token !== token) {
      return res
        .status(403)
        .json({ message: "Unauthorized", success: false });
    }

    await Admin.deleteOne({
      id,
    });

    res.status(200).json({ message: "Admin deleted", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Admin", error, success: false });
  }
};

// Admin update
const updateAdminController = async (req: Request, res: Response) => {
  const { name, email, mobile, password } = req.body;
  const token = req.headers.token;

  if (!name || !email || !mobile || !password) {
    return res
      .status(400)
      .json({ message: "All fields are required", success: false });
  }

  try {
    // Check if admin exists in the database
    const adminExists = await Admin.findOne({ token });

    if (!adminExists) {
      return res
        .status(400)
        .json({ message: "Admin does not exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.updateOne(
      { token },
      {
        name: name,
        email: email,
        mobile: mobile,
        password: hashedPassword,
      }
    );

    res.status(200).json({ message: "Admin updated", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Admin", error, success: false });
  }
};

// suspend teacher
const adminSuspendTeacherCtrl = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Teacher ID is required" });
  }

  try {
    // Check if teacher exists in the database
    const teacher = await Teacher.findOne({ teacherId: id });

    if (!teacher) {
      return res.status(400).json({ message: "Teacher does not exists" });
    }

    await Teacher.updateOne(
      { teacherId: id },
      {
        isSuspended: true,
      }
    );

    res.status(200).json({ message: "Teacher suspended successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error suspending teacher", error });
  }
};

// unsuspend teacher
const adminUnSuspendTeacherCtrl = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Teacher ID is required" });
  }

  try {
    // Check if teacher exists in the database
    const teacher = await Teacher.findOne({ teacherId: id });

    if (!teacher) {
      return res.status(400).json({ message: "Teacher does not exists" });
    }

    await Teacher.updateOne(
      { teacherId: id },
      {
        isSuspended: false,
      }
    );

    res.status(200).json({ message: "Teacher unsuspended successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error unsuspending teacher", error });
  }
};

// teacher left or fired
const adminRemoveTeacherCtrl = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Teacher ID is required" });
  }

  try {
    // Check if teacher exists in the database
    const teacher = await Teacher.findOne({ teacherId: id });

    if (!teacher) {
      return res.status(400).json({ message: "Teacher does not exists" });
    }

    await Teacher.updateOne(
      { teacherId: id },
      {
        employedCurrently: false,
      }
    );

    res.status(200).json({ message: "Teacher removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing teacher", error });
  }
};

// publish exam results
const adminPublishResultsCtrl = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Exam ID is required" });
  }

  try {
    // Check if exam exists in the database
    const exam = await Exam.findOne({ examId: id });

    if (!exam) {
      return res.status(400).json({ message: "Exam does not exists" });
    }

    await Exam.updateOne(
      { _id: id },
      {
        resultsPublished: true,
      }
    );

    res.status(200).json({ message: "Exam results published successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error publishing exam results", error });
  }
};

// unpublish exam results
const adminUnPublishResultsCtrl = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Exam ID is required" });
  }

  try {
    // Check if exam exists in the database
    const exam = await Exam.findOne({ examId: id });

    if (!exam) {
      return res.status(400).json({ message: "Exam does not exists" });
    }

    await Exam.updateOne(
      { _id: id },
      {
        resultsPublished: false,
      }
    );

    res.status(200).json({ message: "Exam results unpublished successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error unpublishing exam results", error });
  }
};

// suspend student
const adminSuspendStudentCtrl = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Student ID is required" });
  }

  try {
    // Check if student exists in the database
    const student = await Student.findOne({ studentId: id });

    if (!student) {
      return res.status(400).json({ message: "Student does not exists" });
    }

    await Student.updateOne(
      { studentId: id },
      {
        isSuspended: true,
      }
    );

    res.status(200).json({ message: "Student suspended successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error suspending student", error });
  }
};

// unsuspend student
const adminUnSuspendStudentCtrl = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Student ID is required" });
  }

  try {
    // Check if student exists in the database
    const student = await Student.findOne({ studentId: id });

    if (!student) {
      return res.status(400).json({ message: "Student does not exists" });
    }

    await Student.updateOne(
      { studentId: id },
      {
        isSuspended: false,
      }
    );

    res.status(200).json({ message: "Student unsuspended successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error unsuspending student", error });
  }
};

// student graduated
const adminGraduateStudentCtrl = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Student ID is required" });
  }

  try {
    // Check if student exists in the database
    const student = await Student.findOne({ studentId: id });

    if (!student) {
      return res.status(400).json({ message: "Student does not exists" });
    }

    await Student.updateOne(
      { studentId: id },
      {
        graduated: true,
      }
    );

    res.status(200).json({ message: "Student graduated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error graduating student", error });
  }
};

// student is expelled
const adminExpelStudentCtrl = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Student ID is required" });
  }

  try {
    // Check if student exists in the database
    const student = await Student.findOne({ studentId: id });

    if (!student) {
      return res.status(400).json({ message: "Student does not exists" });
    }

    await Student.updateOne(
      { studentId: id },
      {
        expelled: true,
      }
    );

    res.status(200).json({ message: "Student expelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error expelling student", error });
  }
};

export {
  registerAdminController,
  loginAdminController,
  deleteAdminController,
  updateAdminController,
  adminSuspendTeacherCtrl,
  adminUnSuspendTeacherCtrl,
  adminRemoveTeacherCtrl,
  adminPublishResultsCtrl,
  adminUnPublishResultsCtrl,
  adminSuspendStudentCtrl,
  adminUnSuspendStudentCtrl,
  adminGraduateStudentCtrl,
  adminExpelStudentCtrl,
};
