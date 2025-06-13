import Admin from "../models/Admin";
import type { Request, Response } from "express";
import ClassLevel from "../models/ClassLevel";
import { v4 as uuidv4 } from "uuid";
import Subject from "../models/Subject";
import Teacher from "../models/Teacher";
import Student from "../models/Student";

// create class level
const createClassLevel = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    //check name exists
    const createClassLevelFound = await ClassLevel.findOne({ name });
    if (createClassLevelFound) {
      throw new Error("Class level already exists");
    }

    const admin = await Admin.findOne({ token: req.headers.token });

    if (!admin) {
      throw new Error("Admin not found");
    }
    const classLevel = new ClassLevel({
      name,
      description,
      createdBy: admin._id,
      classId: uuidv4().replace(/-/g, "").slice(0, 18),
    });
    await classLevel.save();

    res.status(201).json({
      status: "success",
      message: "Class level created successfully",
      data: classLevel,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// get all class levels
const getClassLevels = async (req: Request, res: Response) => {
  try {
    const classLevels = await ClassLevel.find({});

    res.status(201).json({
      status: "success",
      message: "Class levels fetched successfully",
      data: classLevels,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// get class level by id
const getClassLevel = async (req: Request, res: Response) => {
  const classLevel = await ClassLevel.findOne({ classId: req.params.id });

  if (!classLevel) {
    throw new Error("Class level not found");
  }

  res.status(201).json({
    status: "success",
    message: "Class level fetched successfully",
    data: classLevel,
  });
};

// update class level
const updateClassLevel = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const classLevel = await ClassLevel.findOneAndUpdate(
      { classId: req.params.id },
      {
        name,
        description,
      },
      { new: true }
    );

    if (!classLevel) {
      throw new Error("Class level not found");
    }

    res.status(201).json({
      status: "success",
      message: "Class level updated successfully",
      data: classLevel,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// delete class level
const deleteClassLevel = async (req: Request, res: Response) => {
  try {
    const classLevel = await ClassLevel.findOneAndDelete({
      classId: req.params.id,
    });

    if (!classLevel) {
      throw new Error("Class level not found");
    }

    res.status(201).json({
      status: "success",
      message: "Class level deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

//add and remove Subjects from class level
const addremoveSubjects = async (req: Request, res: Response) => {
  try {
    const { subjectId, action } = req.body; // action can be 'add' or 'remove'
    const classLevel = await ClassLevel.findOne({ classId: req.params.id });
    if (!classLevel) {
      return res.status(404).json({
        status: "error",
        message: "Class level not found",
      });
    }

    const subject = await Subject.findOne({ subjectId: subjectId });
    if (!subject) {
      return res.status(404).json({
        status: "error",
        message: "Subject not found",
      });
    }
    if (action === "add") {
      if (classLevel.subjects.includes(subject._id)) {
        return res.status(400).json({
          status: "error",
          message: "Subject already exists in the class level",
        });
      }
      classLevel.subjects.push(subject._id);
    } else if (action === "remove") {
      const index = classLevel.subjects.indexOf(subject._id);
      if (index === -1) {
        return res.status(400).json({
          status: "error",
          message: "Subject not found in the class level",
        });
      }
      classLevel.subjects.splice(index, 1);
    } else {
      return res.status(400).json({
        status: "error",
        message: "Invalid action. Use 'add' or 'remove'.",
      });
    }
    await classLevel.save();
    res.status(200).json({
      status: "success",
      message: `Subject ${action}ed successfully`,
      data: classLevel,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// add and remove teachers from class level
const addremoveTeachers = async (req: Request, res: Response) => {
  try {
    const { teacherId, action } = req.body; // action can be 'add' or 'remove'
    const classLevel = await ClassLevel.findOne({ classId: req.params.id });
    if (!classLevel) {
      return res.status(404).json({
        status: "error",
        message: "Class level not found",
      });
    }
    const teacher = await Teacher.findOne({ teacherId: teacherId });
    if (!teacher) {
      return res.status(404).json({
        status: "error",
        message: "Teacher not found",
      });
    }
    if (action === "add") {
      if (classLevel.teachers.includes(teacher._id)) {
        return res.status(400).json({
          status: "error",
          message: "Teacher already exists in the class level",
        });
      }
      classLevel.teachers.push(teacher._id);
    } else if (action === "remove") {
      const index = classLevel.teachers.indexOf(teacher._id);
      if (index === -1) {
        return res.status(400).json({
          status: "error",
          message: "Teacher not found in the class level",
        });
      }
      classLevel.teachers.splice(index, 1);
    } else {
      return res.status(400).json({
        status: "error",
        message: "Invalid action. Use 'add' or 'remove'.",
      });
    }
    await classLevel.save();
    res.status(200).json({
      status: "success",
      message: `Teacher ${action}ed successfully`,
      data: classLevel,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Add and remove students from class level
const addremoveStudents = async (req: Request, res: Response) => {
  try {
    const { studentId, action } = req.body; // action can be 'add' or 'remove'
    const classLevel = await ClassLevel.findOne({ classId: req.params.id });
    if (!classLevel) {
      return res.status(404).json({
        status: "error",
        message: "Class level not found",
      });
    }
    const student = await Student.findOne({ studentId: studentId });
    if (!student) {
      return res.status(404).json({
        status: "error",
        message: "Student not found",
      });
    }
    if (action === "add") {
      if (classLevel.students.includes(student._id)) {
        return res.status(400).json({
          status: "error",
          message: "Student already exists in the class level",
        });
      }
      classLevel.students.push(student._id);
    } else if (action === "remove") {
      const index = classLevel.students.indexOf(student._id);
      if (index === -1) {
        return res.status(400).json({
          status: "error",
          message: "Student not found in the class level",
        });
      }
      classLevel.students.splice(index, 1);
    } else {
      return res.status(400).json({
        status: "error",
        message: "Invalid action. Use 'add' or 'remove'.",
      });
    }
    await classLevel.save();
    res.status(200).json({
      status: "success",
      message: `Student ${action}ed successfully`,
      data: classLevel,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

export {
  createClassLevel,
  getClassLevels,
  getClassLevel,
  updateClassLevel,
  deleteClassLevel,
  addremoveSubjects,
  addremoveTeachers,
  addremoveStudents,
};
