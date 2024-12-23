import Admin from "../models/Admin";
import ClassLevel from "../models/ClassLevel";
import Program from "../models/Program";
import Subject from "../models/Subject";
import type { Request, Response } from "express";

const createProgram = async (req: Request, res: Response) => {
  const { name, description, adminEmail } = req.body;
  //check if exists
  const programFound = await Program.findOne({ name });
  if (programFound) {
    throw new Error("Program  already exists");
  }

  // admin
  const admin = await Admin.findOne({ email: adminEmail });
  if (!admin) {
    throw new Error("Admin not found");
  }
  //create
  const programCreated = await Program.create({
    name,
    description,
    createdBy: admin._id,
  });
  //push program into admin

  admin.programs.push(programCreated._id);
  //save
  await admin.save();

  res.status(201).json({
    status: "success",
    message: "Program created successfully",
    data: programCreated,
  });
};

const getPrograms = async (req: Request, res: Response) => {
  const programs = await Program.find();
  res.status(201).json({
    status: "success",
    message: "Programs fetched successfully",
    data: programs,
  });
};

const getProgram = async (req: Request, res: Response) => {
  const program = await Program.findById(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Program fetched successfully",
    data: program,
  });
};

const updatProgram = async (req: Request, res: Response) => {
  const { name, description, adminEmail } = req.body;
  //check name exists
  const programFound = await ClassLevel.findOne({ name });
  if (programFound) {
    throw new Error("Program already exists");
  }
  const admin = await Admin.findOne({ email: adminEmail });
  if (!admin) {
    throw new Error("Admin not found");
  }
  const program = await Program.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      createdBy: admin._id,
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
};

const deleteProgram = async (req: Request, res: Response) => {
  await Program.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Program deleted successfully",
  });
};

const addSubjectToProgram = async (req: Request, res: Response) => {
  const { name } = req.body;
  //get the program
  const program = await Program.findById(req.params.id);
  if (!program) {
    throw new Error("Program not found");
  }
  //Find the subject
  const subjectFound = await Subject.findOne({ name });
  if (!subjectFound) {
    throw new Error("Subject not found");
  }
  //Check if subject exists
  const subjectExists = program.subjects?.find(
    (sub) => sub?.toString() === subjectFound?._id.toString()
  );
  if (subjectExists) {
    throw new Error("Subject already exists");
  }
  //push the subj into program
  program.subjects.push(subjectFound?._id);
  //save
  await program.save();
  res.status(201).json({
    status: "success",
    message: "Subject added successfully",
    data: program,
  });
};

export {
  createProgram,
  getPrograms,
  getProgram,
  updatProgram,
  deleteProgram,
  addSubjectToProgram,
};
