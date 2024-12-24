import Admin from "../models/Admin";
import type { Request, Response } from "express";
import Notice from "../models/Notice";

// create notice
const createNotice = async (req: Request, res: Response) => {
  const { title, details, date, adminEmail } = req.body;

  const admin = await Admin.findOne({ email: adminEmail });

  if (!admin) {
    throw new Error("Admin not found");
  }
  const notice = new Notice({
    title,
    details,
    date,
    createdBy: admin.id,
  });
  await notice.save();

  res.status(201).json({
    status: "success",
    message: "Notice created successfully",
    data: notice,
  });
};

// get all notices
const getNotices = async (req: Request, res: Response) => {
  const notices = await Notice.find();

  res.status(201).json({
    status: "success",
    message: "Notices fetched successfully",
    data: notices,
  });
};

// get notice by id
const getNotice = async (req: Request, res: Response) => {
  const notice = await Notice.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Notice fetched successfully",
    data: notice,
  });
};

// update notice
const updateNotice = async (req: Request, res: Response) => {
  const { title, details, date, adminEmail } = req.body;
  const admin = await Admin.findOne({ email: adminEmail });

  if (!admin) {
    throw new Error("Admin not found");
  }

  const notice = await Notice.findByIdAndUpdate(
    req.params.id,
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
};

// delete notice
const deleteNotice = async (req: Request, res: Response) => {
  await Notice.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Notice deleted successfully",
  });
};

export { createNotice, getNotices, getNotice, updateNotice, deleteNotice };
