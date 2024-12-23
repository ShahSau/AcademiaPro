import express from "express";
import isAdmin from "../middlewares/isAdmin";
import verifyToken from "../middlewares/verifyToken";
import {
  createClassLevel,
  getClassLevels,
  getClassLevel,
  updateClassLevel,
  deleteClassLevel,
} from "../controllers/classLevelController";

const classLevelRouter = express.Router();

classLevelRouter.post("/", verifyToken, isAdmin, createClassLevel);
classLevelRouter.get("/", verifyToken, isAdmin, getClassLevels);

classLevelRouter.get("/:id", verifyToken, isAdmin, getClassLevel);
classLevelRouter.put("/:id", verifyToken, isAdmin, updateClassLevel);
classLevelRouter.delete("/:id", verifyToken, isAdmin, deleteClassLevel);

export default classLevelRouter;
