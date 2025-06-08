import Attendance from "../models/Attendence";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Types } from "mongoose";
import Admin from "../models/Admin";
import Teacher from "../models/Teacher";

// Create a new attendance record
const createAttendance = async (req: Request, res: Response) => {
  try {
    const { studentId, classLevelId, status, remarks } = req.body;
    const token = req.headers.token;

    // Validate input
    if (!studentId || !classLevelId || !status) {
      throw new Error("Missing required fields");
    }

    const validStatuses = ["present", "absent", "late"];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status. Must be one of: present, absent, late");
    }
    // Check if the teacher exists
    const teacher = await Teacher.findOne({ token });
    if (!teacher) {
      throw new Error("Teacher not found");
    }

    const attendance = new Attendance({
      student: new Types.ObjectId(studentId),
      classLevel: new Types.ObjectId(classLevelId),
      status,
      remarks,
      id: uuidv4().replace(/-/g, "").slice(0, 14),
    });

    await attendance.save();

    res.status(201).json({
      status: "success",
      message: "Attendance created successfully",
      data: attendance,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Get attendance records for a specific class level
const getAttendanceByClassLevel = async (req: Request, res: Response) => {
  try {
    const classLevelId = req.params.classLevelId;
    const token = req.headers.token;
    // Validate classLevelId
    if (!Types.ObjectId.isValid(classLevelId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid class level ID",
      });
    }
    // Check if the class level exists
    const classLevelExists = await Attendance.exists({
      classLevel: classLevelId,
    });
    if (!classLevelExists) {
      return res.status(404).json({
        status: "error",
        message: "Class level not found",
      });
    }

    // isAdmin
    const admin = await Admin.findOne({ token });
    if (!admin) {
      return res.status(403).json({
        status: "error",
        message: "Unauthorized access. Admin token is required.",
      });
    }
    // isTeacher
    const teacher = await Teacher.findOne({ token });
    if (!teacher) {
      throw new Error("Teacher not found");
    }

    const attendanceRecords = await Attendance.find({
      classLevel: classLevelId,
    })
      .populate("student")
      .populate("classLevel");

    res.status(200).json({
      status: "success",
      message: "Attendance records fetched successfully",
      data: attendanceRecords,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Get attendance records for a specific student
const getAttendanceByStudent = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId;
    const token = req.headers.token;

    // isAdmin
    const admin = await Admin.findOne({ token });
    if (!admin) {
      return res.status(403).json({
        status: "error",
        message: "Unauthorized access. Admin token is required.",
      });
    }
    // isTeacher
    const teacher = await Teacher.findOne({ token });
    if (!teacher) {
      throw new Error("Teacher not found");
    }
    const attendanceRecords = await Attendance.find({ student: studentId })
      .populate("student")
      .populate("classLevel");

    res.status(200).json({
      status: "success",
      message: "Attendance records fetched successfully",
      data: attendanceRecords,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Get attendance records for a specific date
const getAttendanceByDate = async (req: Request, res: Response) => {
  try {
    const date = new Date(req.params.date);
    const token = req.headers.token;

    // isAdmin
    const admin = await Admin.findOne({ token });
    if (!admin) {
      return res.status(403).json({
        status: "error",
        message: "Unauthorized access. Admin token is required.",
      });
    }
    // isTeacher
    const teacher = await Teacher.findOne({ token });
    if (!teacher) {
      throw new Error("Teacher not found");
    }
    const attendanceRecords = await Attendance.find({
      date: { $gte: date, $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) },
    })
      .populate("student")
      .populate("classLevel");

    res.status(200).json({
      status: "success",
      message: "Attendance records for the date fetched successfully",
      data: attendanceRecords,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Update an attendance record
const updateAttendance = async (req: Request, res: Response) => {
  try {
    const attendanceId = req.params.id;
    const { status, remarks } = req.body;
    const token = req.headers.token;

    // isAdmin
    const admin = await Admin.findOne({ token });
    if (!admin) {
      return res.status(403).json({
        status: "error",
        message: "Unauthorized access. Admin token is required.",
      });
    }

    // Validate input
    if (!status) {
      throw new Error("Status is required");
    }

    const validStatuses = ["present", "absent", "late"];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status. Must be one of: present, absent, late");
    }

    const attendance = await Attendance.findOne({ id: attendanceId });
    if (!attendance) {
      return res.status(404).json({
        status: "error",
        message: "Attendance record not found",
      });
    }

    attendance.status = status;
    attendance.remarks = remarks;

    await attendance.save();

    res.status(200).json({
      status: "success",
      message: "Attendance updated successfully",
      data: attendance,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

export {
  createAttendance,
  getAttendanceByClassLevel,
  getAttendanceByStudent,
  getAttendanceByDate,
  updateAttendance,
};
