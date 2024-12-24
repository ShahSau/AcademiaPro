import express from "express";
import verifyToken from "../middlewares/verifyToken";
import isAdmin from "../middlewares/isAdmin";
import {
  createAcademicTerm,
  deleteAcademicTerm,
  getAcademicTerm,
  getAcademicTerms,
  updateAcademicTerms,
} from "../controllers/academicTermController";

const academicTermRouter = express.Router();

academicTermRouter.post("/", verifyToken, isAdmin, createAcademicTerm);
academicTermRouter.get("/", verifyToken, isAdmin, getAcademicTerms);

academicTermRouter.get("/:id", verifyToken, isAdmin, getAcademicTerm);
academicTermRouter.put("/:id", verifyToken, isAdmin, updateAcademicTerms);
academicTermRouter.delete("/:id", verifyToken, isAdmin, deleteAcademicTerm);

export default academicTermRouter;
