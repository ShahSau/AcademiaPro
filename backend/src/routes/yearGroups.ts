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

yearGroupRouter
  .route("/")
  .post(verifyToken, isAdmin, createYearGroup)
  .get(verifyToken, isAdmin, getYearGroups);

yearGroupRouter
  .route("/:id")
  .get(verifyToken, isAdmin, getYearGroup)
  .put(verifyToken, isAdmin, updateYearGroup)
  .delete(verifyToken, isAdmin, deleteYearGroup);

export default yearGroupRouter;
