import express from "express";
import verifyToken from "../middlewares/verifyToken";
import isAdmin from "../middlewares/isAdmin";
import isStudent from "../middlewares/isStudent";
import {
  checkExamResults,
  getAllExamResults,
  adminToggleExamResult,
} from "../controllers/examResultsController";

const examResultRouter = express.Router();

examResultRouter.get("/", verifyToken, isStudent, getAllExamResults);
examResultRouter.get("/:id/checking", verifyToken, isStudent, checkExamResults);

examResultRouter.put(
  "/:id/admin-toggle-publish",
  verifyToken,
  isAdmin,
  adminToggleExamResult
);

export default examResultRouter;
