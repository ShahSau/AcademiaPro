import express from "express";
import verifyToken from "../middlewares/verifyToken";
import isTeacher from "../middlewares/isTeacher";
import {
  getExams,
  createExam,
  getExam,
  updatExam,
} from "../controllers/examController";

const examRouter = express.Router();

examRouter.get("/", verifyToken, isTeacher, getExams);
examRouter.post("/", verifyToken, isTeacher, createExam);
examRouter.get("/:id", verifyToken, isTeacher, getExam);
examRouter.put("/:id", verifyToken, isTeacher, updatExam);

module.exports = examRouter;
