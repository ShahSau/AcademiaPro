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

/**
 * @swagger
 * /api/v1/teachers/admin/register:
 *   post:
 *     summary: Register a teacher
 *     description: Register a teacher
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
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
 *                 description: Name of the teacher
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: Email of the teacher
 *                 example: john.doe@email.com
 *               password:
 *                 type: string
 *                 description: Password of the teacher
 *                 example: password
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
teachersRouter.post(
  "/admin/register",
  verifyToken,
  isAdmin,
  adminRegisterTeacher
);

/**
 * @swagger
 * /api/v1/teachers/login:
 *   post:
 *     summary: Login a teacher
 *     description: Login a teacher
 *     tags:
 *       - Teachers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the teacher
 *                 example: john.eod@email.com
 *               password:
 *                 type: string
 *                 description: Password of the teacher
 *                 example: password
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
teachersRouter.post("/login", loginTeacher);

/**
 * @swagger
 * /api/v1/teachers/profile:
 *   get:
 *     summary: Get teacher profile
 *     description: Get teacher profile
 *     tags:
 *       - Teachers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           format: JWT
 *         description: Token for authorization.
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
teachersRouter.get("/profile", verifyToken, isTeacher, getTeacherProfile);

/**
 * @swagger
 * /api/v1/teachers/{teacherID}/admin:
 *   get:
 *     summary: Get teacher by admin
 *     description: Get teacher by admin
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           format: JWT
 *         description: Token for authorization.
 *       - in: path
 *         name: teacherID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the teacher
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
teachersRouter.get(
  "/:teacherID/admin",
  verifyToken,
  isAdmin,
  getTeacherByAdmin
);

/**
 * @swagger
 * /api/v1/teachers/{teacherID}/update:
 *   put:
 *     summary: Update teacher profile
 *     description: Update teacher profile
 *     tags:
 *       - Teachers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           format: JWT
 *         description: Token for authorization.
 *       - in: path
 *         name: teacherID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the teacher
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the teacher
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: Email of the teacher
 *                 example: john.doe@email.com
 *               password:
 *                 type: string
 *                 description: Password of the teacher
 *                 example: password
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
teachersRouter.put(
  "/:teacherID/update",
  verifyToken,
  isTeacher,
  teacherUpdateProfile
);

/**
 * @swagger
 * /api/v1/teachers/{teacherID}/update/admin:
 *   put:
 *     summary: Update teacher by admin
 *     description: Update teacher by admin
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           format: JWT
 *         description: Token for authorization.
 *       - in: path
 *         name: teacherID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the teacher
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               program:
 *                 type: string
 *                 description: ID of the program
 *                 example: 60f3b3b3b3b3b3b3b3b3b3b3
 *               classLevel:
 *                 type: string
 *                 description: ID of the class level
 *                 example: 60f3b3b3b3b3b3b3b3b3b3
 *               academicYear:
 *                 type: string
 *                 description: ID of the academic year
 *                 example: 60f3b3b3b3b3b3b3b3b3b3
 *               subject:
 *                 type: string
 *                 description: ID of the subject
 *                 example: 60f3b3b3b3b3b3b3b3b3b3
 *               employed:
 *                 type: boolean
 *                 description: Employment status of the teacher
 *                 example: true
 *               suspend:
 *                 type: boolean
 *                 description: Suspension status of the teacher
 *                 example: false
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

teachersRouter.put(
  "/:teacherID/update/admin",
  verifyToken,
  isAdmin,
  adminUpdateTeacher
);






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




export default teachersRouter;
