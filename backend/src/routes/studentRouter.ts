import express from "express";
import isAdmin from "../middlewares/isAdmin";
import verifyToken from "../middlewares/verifyToken";
// import Student from "../models/Student";
import isStudent from "../middlewares/isStudent";

import {
  adminRegisterStudent,
  loginStudent,
} from "../controllers/students/adminRegisterStudent";

const studentRouter = express.Router();

studentRouter.post(
  "/admin/register",
  verifyToken,
  isAdmin,
  adminRegisterStudent
);

studentRouter.post("/login", loginStudent);

studentRouter.get("/profile", verifyToken, getStudentProfile);

studentRouter.get("/admin", verifyToken, isAdmin, getAllStudentsByAdmin);

studentRouter.get("/admin/:studentID", verifyToken, isAdmin, getStudentByAdmin);

studentRouter.put("/update", verifyToken, isStudent, updateStudentProfile);

studentRouter.post("/exam/:examID/write", verifyToken, isStudent, writeExam);

studentRouter.put(
  "/:studentID/update/admin",
  verifyToken,
  isAdmin,
  adminUpdateStudent
);

export default studentRouter;
