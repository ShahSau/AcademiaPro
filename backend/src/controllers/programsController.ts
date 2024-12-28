import Admin from "../models/Admin";
import Program from "../models/Program";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import generateProgramCode from "../utils/programCode";

const createProgram = async (req: Request, res: Response) => {
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

  //create
  const programCreated = await Program.create({
    name,
    description,
    duration,
    code,
    createdBy: admin.id,
    id: uuidv4().replace(/-/g, "").slice(0, 24),
  });

  admin.programs.push(programCreated.id);

  await admin.save();

  res.status(201).json({
    status: "success",
    message: "Program created successfully",
    data: programCreated,
  });
};

const getPrograms = async (req: Request, res: Response) => {
  const programs = await Program.find({});
  res.status(201).json({
    status: "success",
    message: "Programs fetched successfully",
    data: programs,
  });
};

const getProgram = async (req: Request, res: Response) => {
  const program = await Program.findOne({ id: req.params.id });
  res.status(201).json({
    status: "success",
    message: "Program fetched successfully",
    data: program,
  });
};

const updatProgram = async (req: Request, res: Response) => {
  const { name, description, duration } = req.body;

  const programFound = await Program.findOne({ id: req.params.id });

  if (!programFound) {
    throw new Error("Program dosenot exists");
  }

  const admin = await Admin.findOne({ token: req.headers.token });

  if (!admin) {
    throw new Error("Admin not found");
  }

  const program = await Program.findOneAndUpdate(
    { id: req.params.id },
    {
      name,
      description,
      duration,
      code: programFound.code,
      createdBy: admin.id,
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
  await Program.findOneAndDelete({ id: req.params.id });
  res.status(201).json({
    status: "success",
    message: "Program deleted successfully",
  });
};

// const addSubjectToProgram = async (req: Request, res: Response) => {
//   const { name } = req.body;
//   //get the program
//   const program = await Program.findOne({id:req.params.id});
//   if (!program) {
//     throw new Error("Program not found");
//   }
//   //Find the subject
//   const subjectFound = await Subject.findOne({ name });
//   if (!subjectFound) {
//     throw new Error("Subject not found");
//   }
//   //Check if subject exists
//   const subjectExists = program.subjects?.find(
//     (sub) => sub?.toString() === subjectFound?.id.toString()
//   );
//   if (subjectExists) {
//     throw new Error("Subject already exists");
//   }
//   //push the subj into program
//   program.subjects.push(subjectFound?.id);
//   //save
//   await program.save();
//   res.status(201).json({
//     status: "success",
//     message: "Subject added successfully",
//     data: program,
//   });
// };

export {
  createProgram,
  getPrograms,
  getProgram,
  updatProgram,
  deleteProgram,
  // addSubjectToProgram,
};
