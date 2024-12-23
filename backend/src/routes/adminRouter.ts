import express from "express";
import verifyToken from "../middlewares/verifyToken";
import isAdmin from "../middlewares/isAdmin";
import {
  adminExpelStudentCtrl,
  adminGraduateStudentCtrl,
  adminPublishResultsCtrl,
  adminRemoveTeacherCtrl,
  adminSuspendStudentCtrl,
  adminSuspendTeacherCtrl,
  adminUnPublishResultsCtrl,
  adminUnSuspendStudentCtrl,
  adminUnSuspendTeacherCtrl,
  deleteAdminController,
  loginAdminController,
  registerAdminController,
  updateAdminController,
} from "../controllers/adminController";
// import advancedResults from "../../middlewares/advancedResults";

const adminRouter = express.Router();

//register
adminRouter.post("/register", registerAdminController); // add isAdmin middleware

//login
adminRouter.post("/login", verifyToken, isAdmin, loginAdminController);

//delete
adminRouter.delete("/:id", verifyToken, isAdmin, deleteAdminController); // add isAdmin middleware

//update
adminRouter.put("/", verifyToken, isAdmin, updateAdminController); // add isAdmin middleware

// suspend teacher
adminRouter.put(
  "/suspend/teacher/:id",
  verifyToken,
  isAdmin,
  adminSuspendTeacherCtrl
);

//unsuspend teacher
adminRouter.put(
  "/unsuspend/teacher/:id",
  verifyToken,
  isAdmin,
  adminUnSuspendTeacherCtrl
);

//teacher left or fired
adminRouter.put(
  "/withdraw/teacher/:id",
  verifyToken,
  isAdmin,
  adminRemoveTeacherCtrl
);

//publish exams
adminRouter.put(
  "/publish/exam/:id",
  verifyToken,
  isAdmin,
  adminPublishResultsCtrl
);

//unpublish exams results
adminRouter.put(
  "/unpublish/exam/:id",
  verifyToken,
  isAdmin,
  adminUnPublishResultsCtrl
);

// suspend student
adminRouter.put(
  "/suspend/student/:id",
  verifyToken,
  isAdmin,
  adminSuspendStudentCtrl
);

//unsuspend student
adminRouter.put(
  "/unsuspend/student/:id",
  verifyToken,
  isAdmin,
  adminUnSuspendStudentCtrl
);

//student graduated
adminRouter.put(
  "/graduate/student/:id",
  verifyToken,
  isAdmin,
  adminGraduateStudentCtrl
);

// student is expelled
adminRouter.put(
  "/expel/student/:id",
  verifyToken,
  isAdmin,
  adminExpelStudentCtrl
);

//get all
// adminRouter.get("/", isLogin, advancedResults(Admin), getAdminsCtrl);

export default adminRouter;
