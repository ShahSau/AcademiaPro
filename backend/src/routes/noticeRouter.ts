import express from "express";
import verifyToken from "../middlewares/verifyToken";
import isAdmin from "../middlewares/isAdmin";
import {
  createNotice,
  getNotices,
  getNotice,
  updateNotice,
  deleteNotice,
} from "../controllers/noticeController";

const noticeRouter = express.Router();

noticeRouter.post("/", verifyToken, isAdmin, createNotice);
noticeRouter.get("/", verifyToken, isAdmin, getNotices);

noticeRouter.get("/:id", verifyToken, isAdmin, getNotice);
noticeRouter.put("/:id", verifyToken, isAdmin, updateNotice);
noticeRouter.delete("/:id", verifyToken, isAdmin, deleteNotice);

export default noticeRouter;
