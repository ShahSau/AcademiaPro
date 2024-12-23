import express from "express";
import verifyToken from "../middlewares/verifyToken";
import isAdmin from "../middlewares/isAdmin";
import {
  createSubject,
  getSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectsController";

const subjectRouter = express.Router();

subjectRouter.post("/:programID", verifyToken, isAdmin, createSubject);

subjectRouter.get("/", verifyToken, isAdmin, getSubjects);

subjectRouter.get("/:id", verifyToken, isAdmin, getSubject);
subjectRouter.put("/:id", verifyToken, isAdmin, updateSubject);
subjectRouter.delete("/:id", verifyToken, isAdmin, deleteSubject);

export default subjectRouter;
