import Admin from "../models/Admin";
import Program from "../models/Program";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import generateProgramCode from "../utils/programCode";
import Teacher from "../models/Teacher";
import Student from "../models/Student";

// Create a new program
const createProgram = async (req: Request, res: Response) => {
  try {
    const { name, description, duration } = req.body;

    const programFound = await Program.findOne({ name });
    if (programFound) {
      throw new Error("Program  already exists");
    }

    const admin = await Admin.findOne({ token: req.headers.token });
    if (!admin) {
      throw new Error("Admin not found");
    }

    const code = generateProgramCode(name, duration);

    const programCreated = await Program.create({
      name,
      description,
      duration,
      code,
      createdBy: admin._id,
      programId:
        uuidv4().replace(/-/g, "").slice(0, 22) +
        name[0].toUpperCase() +
        duration[0].toUpperCase(),
    });

    admin.programs.push(programCreated._id);

    await admin.save();

    res.status(201).json({
      status: "success",
      message: "Program created successfully",
      data: programCreated,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Get all programs
const getPrograms = async (req: Request, res: Response) => {
  try {
    const programs = await Program.find({});
    res.status(201).json({
      status: "success",
      message: "Programs fetched successfully",
      data: programs,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Get a specific program by ID
const getProgram = async (req: Request, res: Response) => {
  try {
    const program = await Program.findOne({ programId: req.params.id });
    if (!program) {
      throw new Error("Program not found");
    }
    res.status(201).json({
      status: "success",
      message: "Program fetched successfully",
      data: program,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Update a program by Admin
const updateProgram = async (req: Request, res: Response) => {
  try {
    const { name, description, duration } = req.body;

    const programFound = await Program.findOne({ programId: req.params.id });

    if (!programFound) {
      throw new Error("Program dosenot exists");
    }

    const admin = await Admin.findOne({ token: req.headers.token });

    if (!admin) {
      throw new Error("Admin not found");
    }

    const program = await Program.findOneAndUpdate(
      { programId: req.params.id },
      {
        name,
        description,
        duration,
        code: programFound.code,
      },
      {
        new: true,
      }
    );

    res.status(201).json({
      status: "success",
      message: "Program  updated successfully",
      data: program,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Delete a program by Admin
const deleteProgram = async (req: Request, res: Response) => {
  try {
    const program = await Program.findOne({ programId: req.params.id });

    if (!program) {
      throw new Error("Program not found");
    }

    await Program.deleteOne({ programId: req.params.id });

    res.status(201).json({
      status: "success",
      message: "Program deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Add teachers to a program
const addTeachersToProgram = async (req: Request, res: Response) => {
  try {
    const { teacherIds } = req.body;
    const program = await Program.findOne({ programId: req.params.id });
    if (!program) {
      throw new Error("Program not found");
    }
    const teachers = await Teacher.find({ _id: { $in: teacherIds } });
    if (teachers.length !== teacherIds.length) {
      throw new Error("Some teachers not found");
    }
    program.teachers.push(...teachers.map((teacher) => teacher._id));
    await program.save();
    res.status(201).json({
      status: "success",
      message: "Teachers added to program successfully",
      data: program,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Add students to a program
const addStudentsToProgram = async (req: Request, res: Response) => {
  try {
    const { studentIds } = req.body;
    const program = await Program.findOne({ programId: req.params.id });
    if (!program) {
      throw new Error("Program not found");
    }
    const students = await Student.find({ _id: { $in: studentIds } });
    if (students.length !== studentIds.length) {
      throw new Error("Some students not found");
    }
    program.students.push(...studentIds);
    await program.save();
    res.status(201).json({
      status: "success",
      message: "Students added to program successfully",
      data: program,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Add subjects to a program
const addSubjectsToProgram = async (req: Request, res: Response) => {
  try {
    const { subjectIds } = req.body;
    const program = await Program.findOne({ programId: req.params.id });
    if (!program) {
      throw new Error("Program not found");
    }
    const subjects = await Program.find({ _id: { $in: subjectIds } });
    if (subjects.length !== subjectIds.length) {
      throw new Error("Some subjects not found");
    }
    program.subjects.push(...subjectIds);
    await program.save();
    res.status(201).json({
      status: "success",
      message: "Subjects added to program successfully",
      data: program,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Get all teachers in a program
const getTeachersInProgram = async (req: Request, res: Response) => {
  try {
    const program = await Program.findOne({
      programId: req.params.id,
    }).populate("teachers");
    if (!program) {
      throw new Error("Program not found");
    }
    res.status(201).json({
      status: "success",
      message: "Teachers in program fetched successfully",
      data: program.teachers,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Get all students in a program
const getStudentsInProgram = async (req: Request, res: Response) => {
  try {
    const program = await Program.findOne({
      programId: req.params.id,
    }).populate("students");
    if (!program) {
      throw new Error("Program not found");
    }
    res.status(201).json({
      status: "success",
      message: "Students in program fetched successfully",
      data: program.students,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Get all subjects in a program
const getSubjectsInProgram = async (req: Request, res: Response) => {
  try {
    const program = await Program.findOne({
      programId: req.params.id,
    }).populate("subjects");
    if (!program) {
      throw new Error("Program not found");
    }
    res.status(201).json({
      status: "success",
      message: "Subjects in program fetched successfully",
      data: program.subjects,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};
export {
  createProgram,
  getPrograms,
  getProgram,
  updateProgram,
  deleteProgram,
  addTeachersToProgram,
  addStudentsToProgram,
  addSubjectsToProgram,
  getTeachersInProgram,
  getStudentsInProgram,
  getSubjectsInProgram,
};
