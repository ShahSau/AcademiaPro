import Admin from "../models/Admin";
import Program from "../models/Program";
import Subject from "../models/Subject";
import type { Request, Response } from "express";

const createSubject = async (req: Request, res: Response) => {
  const { name, description, academicTerm, adminEmail } = req.body;
  //find the program
  const programFound = await Program.findById(req.params.programID);
  if (!programFound) {
    throw new Error("Program  not found");
  }
  //check if exists
  const subjectFound = await Subject.findOne({ name });
  if (subjectFound) {
    throw new Error("Subject  already exists");
  }
  // admin
  const admin = await Admin.findOne({ email: adminEmail });
  if (!admin) {
    throw new Error("Admin not found");
  }
  //create
  const subjectCreated = await Subject.create({
    name,
    description,
    academicTerm,
    createdBy: admin._id,
  });
  //push to the program
  // programFound.subjects.push(subjectCreated._id);
  //save
  await programFound.save();
  res.status(201).json({
    status: "success",
    message: "Program created successfully",
    data: subjectCreated,
  });
};

const getSubjects = async (req: Request, res: Response) => {
  const classes = await Subject.find();
  res.status(201).json({
    status: "success",
    message: "Subjects fetched successfully",
    data: classes,
  });
};

const getSubject = async (req: Request, res: Response) => {
  const subject = await Subject.findById(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Subject fetched successfully",
    data: subject,
  });
};

const updateSubject = async (req: Request, res: Response) => {
  const { name, description, academicTerm, adminEmail } = req.body;
  //check name exists
  const subjectFound = await Subject.findOne({ name });
  if (subjectFound) {
    throw new Error("Program already exists");
  }
  const admin = await Admin.findOne({ email: adminEmail });
  if (!admin) {
    throw new Error("Admin not found");
  }
  const subject = await Subject.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      academicTerm,
      createdBy: admin._id,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "subject  updated successfully",
    data: subject,
  });
};

const deleteSubject = async (req: Request, res: Response) => {
  await Subject.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: "success",
    message: "subject deleted successfully",
  });
};

export { createSubject, getSubjects, getSubject, updateSubject, deleteSubject };
