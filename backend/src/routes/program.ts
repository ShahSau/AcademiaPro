import express from "express";
import verifyToken from "../middlewares/verifyToken";
import isAdmin from "../middlewares/isAdmin";
import {
  addSubjectToProgram,
  createProgram,
  deleteProgram,
  getProgram,
  getPrograms,
  updatProgram,
} from "../controllers/programsController";

const programRouter = express.Router();

programRouter.post("/", verifyToken, isAdmin, createProgram);
programRouter.get("/", verifyToken, isAdmin, getPrograms);

programRouter.put("/:id/subjects", verifyToken, isAdmin, addSubjectToProgram);

programRouter.get("/:id", verifyToken, isAdmin, getProgram);
programRouter.put("/:id", verifyToken, isAdmin, updatProgram);
programRouter.delete("/:id", verifyToken, isAdmin, deleteProgram);

export default programRouter;
