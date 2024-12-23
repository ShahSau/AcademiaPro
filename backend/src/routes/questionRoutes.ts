import express from "express";
import verifyToken from "../middlewares/verifyToken";
import isTeacher from "../middlewares/isTeacher";
import {
  createQuestion,
  getQuestion,
  getQuestions,
  updateQuestion,
} from "../controllers/questionsController";

const questionsRouter = express.Router();

questionsRouter.get("/", verifyToken, isTeacher, getQuestions);
questionsRouter.get("/:id", verifyToken, isTeacher, getQuestion);
questionsRouter.post("/:examID", verifyToken, isTeacher, createQuestion);
questionsRouter.put("/:id", verifyToken, isTeacher, updateQuestion);

module.exports = questionsRouter;
