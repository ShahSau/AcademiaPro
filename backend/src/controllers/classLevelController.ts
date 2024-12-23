import Admin from "../models/Admin";
import type { Request, Response } from "express";
import ClassLevel from "../models/ClassLevel";

// create class level
const createClassLevel = async (req: Request, res: Response) => {
  const { name, description, adminEmail } = req.body;
  //check name exists
  const createClassLevelFound = await ClassLevel.findOne({ name });
  if (createClassLevelFound) {
    throw new Error("Class level already exists");
  }

  const admin = await Admin.findOne({ email: adminEmail });

  if (!admin) {
    throw new Error("Admin not found");
  }
  const classLevel = new ClassLevel({
    name,
    description,
    createdBy: admin._id,
  });
  await classLevel.save();

  res.status(201).json({
    status: "success",
    message: "Class level created successfully",
    data: classLevel,
  });
};

// get all class levels
const getClassLevels = async (req: Request, res: Response) => {
  const classLevels = await ClassLevel.find();

  res.status(201).json({
    status: "success",
    message: "Class levels fetched successfully",
    data: classLevels,
  });
};

// get class level by id
const getClassLevel = async (req: Request, res: Response) => {
  const classLevel = await ClassLevel.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Class level fetched successfully",
    data: classLevel,
  });
};

// update class level
const updateClassLevel = async (req: Request, res: Response) => {
  const { name, description, adminEmail } = req.body;
  const admin = await Admin.findOne({ email: adminEmail });
  if (!admin) {
    throw new Error("Admin not found");
  }
  const classLevel = await ClassLevel.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      createdBy: admin._id,
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
};

// delete class level
const deleteClassLevel = async (req: Request, res: Response) => {
  const classLevel = await ClassLevel.findByIdAndDelete(req.params.id);

  if (!classLevel) {
    throw new Error("Class level not found");
  }

  res.status(201).json({
    status: "success",
    message: "Class level deleted successfully",
    data: classLevel,
  });
};

export {
  createClassLevel,
  getClassLevels,
  getClassLevel,
  updateClassLevel,
  deleteClassLevel,
};
