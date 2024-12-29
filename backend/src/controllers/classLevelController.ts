import Admin from "../models/Admin";
import type { Request, Response } from "express";
import ClassLevel from "../models/ClassLevel";
import { v4 as uuidv4 } from "uuid";

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
      createdBy: admin.id,
      id: uuidv4().replace(/-/g, "").slice(0, 18),
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
      message: error,
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
      message: error,
    });
  }
};

// get class level by id
const getClassLevel = async (req: Request, res: Response) => {
  const classLevel = await ClassLevel.findOne({ id: req.params.id });

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
    const admin = await Admin.findOne({ token: req.headers.token });
    if (!admin) {
      throw new Error("Admin not found");
    }
    const classLevel = await ClassLevel.findOneAndUpdate(
      { id: req.params.id },
      {
        name,
        description,
        createdBy: admin.id,
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
      message: error,
    });
  }
};

// delete class level
const deleteClassLevel = async (req: Request, res: Response) => {
  try {
    const classLevel = await ClassLevel.findOneAndDelete({ id: req.params.id });

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
      message: error,
    });
  }
};

export {
  createClassLevel,
  getClassLevels,
  getClassLevel,
  updateClassLevel,
  deleteClassLevel,
};
