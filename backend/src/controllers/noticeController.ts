import Admin from "../models/Admin";
import type { Request, Response } from "express";
import Notice from "../models/Notice";
import { v4 as uuidv4 } from "uuid";

const createNotice = async (req: Request, res: Response) => {
  try {
    const { title, details, date } = req.body;

    const admin = await Admin.findOne({ token: req.headers.token });

    if (!admin) {
      throw new Error("Admin not found");
    }
    const notice = new Notice({
      title,
      details,
      date,
      createdBy: admin.id,
      id: uuidv4().replace(/-/g, "").slice(0, 14),
    });
    await notice.save();

    res.status(201).json({
      status: "success",
      message: "Notice created successfully",
      data: notice,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// get all notices
const getNotices = async (req: Request, res: Response) => {
  try {
    const notices = await Notice.find({});

    res.status(201).json({
      status: "success",
      message: "Notices fetched successfully",
      data: notices,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// get notice by id
const getNotice = async (req: Request, res: Response) => {
  try {
    const notice = await Notice.findOne({ id: req.params.id });

    res.status(201).json({
      status: "success",
      message: "Notice fetched successfully",
      data: notice,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// update notice
const updateNotice = async (req: Request, res: Response) => {
  try {
    const { title, details, date } = req.body;
    const admin = await Admin.findOne({ token: req.headers.token });

    if (!admin) {
      throw new Error("Admin not found");
    }

    const notice = await Notice.findOneAndUpdate(
      { id: req.params.id },
      {
        title,
        details,
        date,
        createdBy: admin.id,
      },
      { new: true }
    );

    res.status(201).json({
      status: "success",
      message: "Notice updated successfully",
      data: notice,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// delete notice
const deleteNotice = async (req: Request, res: Response) => {
  await Notice.findOneAndDelete({ id: req.params.id });

  res.status(201).json({
    status: "success",
    message: "Notice deleted successfully",
  });
};

export { createNotice, getNotices, getNotice, updateNotice, deleteNotice };
