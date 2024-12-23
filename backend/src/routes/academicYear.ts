import {
  createAcademicYear,
  getAcademicYears,
  getAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
} from "../controllers/academicYearController";
import isAdmin from "../middlewares/isAdmin";
import verifyToken from "../middlewares/verifyToken";

import express from "express";

const academicYearRouter = express.Router();

academicYearRouter.post("/", verifyToken, isAdmin, createAcademicYear);
academicYearRouter.get("/", verifyToken, isAdmin, getAcademicYears);

academicYearRouter.get("/:id", verifyToken, isAdmin, getAcademicYear);
academicYearRouter.put("/:id", verifyToken, isAdmin, updateAcademicYear);
academicYearRouter.delete("/:id", verifyToken, isAdmin, deleteAcademicYear);

export default academicYearRouter;
