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

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management
 */


/**
 * @swagger
 * /api/v1/admins/register:
 *   post:
 *     summary: Register a new admin
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           format: JWT
 *         description: Token for authorization.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The admin's name.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: The admin's email.
 *                 example: admin@example.com
 *               mobile:
 *                 type: string
 *                 description: The admin's mobile.
 *                 example: 12456
 *               password:
 *                 type: string
 *                 description: The admin's password.
 *                 example: Admin@123
 *     responses:
 *       201:
 *         description: Admin registered successfully.
 *       400:
 *         description: Invalid request data.
 *       500:
 *         description: Error registering admin.
 */

adminRouter.post("/register", verifyToken, isAdmin, registerAdminController);


/**
 * @swagger
 * /api/v1/admins/login:
 *   post:
 *     summary: Login an admin user.
 *     description: Authenticates an admin user with a token and login credentials.
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The admin's email.
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: Admin@123
 *                 description: The admin's password.
 *     responses:
 *       200:
 *         description: Successfully logged in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *                   description: The JWT token for the authenticated session.
 *       401:
 *         description: Unauthorized. Invalid credentials or token.
 *       403:
 *         description: Forbidden. User is not an admin.
 *       500:
 *         description: Internal server error.
 */

adminRouter.post("/login", loginAdminController);

/**
 * @swagger
 * /api/v1/admins/{id}:
 *   delete:
 *     summary: Delete an admin
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           format: JWT
 *         description: Token for authorization.
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The admin's ID.
 *     responses:
 *       200:
 *         description: Admin deleted successfully.
 *       400:
 *         description: Invalid request data.
 *       500:
 *         description: Error deleting admin.
 */

adminRouter.delete("/:id", verifyToken, isAdmin, deleteAdminController);


/**
 * @swagger
 * /api/v1/admins/update:
 *   put:
 *     summary: Update an admin
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           format: JWT
 *         description: Token for authorization.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The admin's name.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: The admin's email.
 *                 example: admin@example.com
 *               mobile:
 *                 type: string
 *                 description: The admin's mobile number.
 *                 example: 12456
 *               password:
 *                 type: string
 *                 description: The admin's password.
 *                 example: Admin@123
 *     responses:
 *       200:
 *         description: Admin updated successfully.
 *       400:
 *         description: Invalid request data.
 *       500:
 *         description: Error updating admin.
 */

adminRouter.put("/update", verifyToken,isAdmin, updateAdminController); 

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
adminRouter.get("/", (req, res) => {
  res.send("Admins route");
});

export default adminRouter;
