import express from "express";
import isAdmin from "../middlewares/isAdmin";
import verifyToken from "../middlewares/verifyToken";
import isTeacher from "../middlewares/isTeacher";
import {
  adminRegisterTeacher,
  adminUpdateTeacher,
  getTeacherByAdmin,
  getTeacherProfile,
  loginTeacher,
  teacherUpdateProfile,
} from "../controllers/teachersController";

const teachersRouter = express.Router();

teachersRouter.post(
  "/admin/register",
  verifyToken,
  isAdmin,
  adminRegisterTeacher
);

teachersRouter.post("/login", loginTeacher);

// teachersRouter.get(
//   "/admin",
//   verifyToken,
//   isAdmin,
//   advancedResults(Teacher, {
//     path: "examsCreated",
//     populate: {
//       path: "questions",
//     },
//   }),
//   getAllTeachersAdmin
// );

teachersRouter.get("/profile", verifyToken, isTeacher, getTeacherProfile);

teachersRouter.get(
  "/:teacherID/admin",
  verifyToken,
  isAdmin,
  getTeacherByAdmin
);

teachersRouter.put(
  "/:teacherID/update",
  verifyToken,
  isTeacher,
  teacherUpdateProfile
);

teachersRouter.put(
  "/:teacherID/update/admin",
  verifyToken,
  isAdmin,
  adminUpdateTeacher
);

export default teachersRouter;
