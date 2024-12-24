import express from "express";
import isAdmin from "../middlewares/isAdmin";
import verifyToken from "../middlewares/verifyToken";
import {
  createYearGroup,
  deleteYearGroup,
  getYearGroup,
  getYearGroups,
  updateYearGroup,
} from "../controllers/yearGroupsController";

const yearGroupRouter = express.Router();

yearGroupRouter.post("/", verifyToken, isAdmin, createYearGroup);

yearGroupRouter.get("/", verifyToken, isAdmin, getYearGroups);

yearGroupRouter.get("/:id", verifyToken, isAdmin, getYearGroup);

yearGroupRouter.put("/:id", verifyToken, isAdmin, updateYearGroup);

yearGroupRouter.delete("/:id", verifyToken, isAdmin, deleteYearGroup);

export default yearGroupRouter;
