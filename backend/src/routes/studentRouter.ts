import express from "express";
import isAdmin from "../middlewares/isAdmin";
import verifyToken from "../middlewares/verifyToken";
import isStudent from "../middlewares/isStudent";

import {
  registerStudentByAdmin,
  loginStudent,
  getStudentProfile,
  getAllStudentsByAdmin,
  getStudentByAdmin,
  updateStudentProfile,
  writeExam,
  adminUpdateStudent,
} from "../controllers/studentsController";

const studentRouter = express.Router();

/**
 * @swagger
 * /api/v1/students/admin/register:
 *   post:
 *     summary: Register a student by admin
 *     description: Register a student by admin
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
 *                 description: Name of the student
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: Email of the student
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: Password of the student
 *                 example: password
 *     responses:
 *       200:
 *         description: A successful registration
 *       400:
 *         description: Error
 *       500:
 *         description: Server error
 */
studentRouter.post(
  "/admin/register",
  verifyToken,
  isAdmin,
  registerStudentByAdmin
);

/**
 * @swagger
 * /api/v1/students/login:
 *   post:
 *     summary: Login a student
 *     description: Login a student
 *     tags:
 *       - Students
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the student
 *                 example: john.doe@email.com
 *               password:
 *                 type: string
 *                 description: Password of the student
 *                 example: password
 *     responses:
 *       200:
 *         description: A successful login
 *       400:
 *         description: Error
 *       500:
 *         description: Server error
 */
studentRouter.post("/login", loginStudent);

/**
 * @swagger
 * /api/v1/students/profile:
 *   get:
 *     summary: Get student profile
 *     description: Get student profile
 *     tags:
 *       - Students
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
studentRouter.get("/profile", verifyToken, isStudent, getStudentProfile);

/**
 * @swagger
 * /api/v1/students/{studentID}/admin:
 *   get:
 *     summary: Get Student by admin
 *     description: Get Student by admin
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
 *         name: studentID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the student
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
studentRouter.get("/:studentID/admin", verifyToken, isAdmin, getStudentByAdmin);

/**
 * @swagger
 * /api/v1/teachers/{teacherID}/update/admin:
 *   put:
 *     summary: Update teacher by admin
 *     description: Update teacher by admin
 *     tags:
 *       - Students
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
 *               email:
 *                 type: string
 *                 description: Email of the student
 *                 example: john.doe@email.com
 *               password:
 *                 type: string
 *                 description: Password of the student
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
studentRouter.put("/update", verifyToken, isStudent, updateStudentProfile);

/**
 * @swagger
 * /api/v1/students/{studentID}/update/admin:
 *   put:
 *     summary: Update student by admin
 *     description: Update student by admin
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
 *         name: studentID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the student
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
 *               Expeled:
 *                 type: boolean
 *                 description: is the student expelled
 *                 example: true
 *               Suspended:
 *                 type: boolean
 *                 description: Suspension status of the student
 *                 example: false
 *               Graduated:
 *                type: boolean
 *                description: Graduation status of the student
 *                example: false
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
studentRouter.put(
  "/:studentID/update/admin",
  verifyToken,
  isAdmin,
  adminUpdateStudent
);

/**
 * @swagger
 * /api/v1/students/admin/all:
 *   get:
 *     summary: Get all students by admin
 *     description: Get all students by admin
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
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
studentRouter.get("/admin/all", verifyToken, isAdmin, getAllStudentsByAdmin);

// studentRouter.post("/exam/:examID/write", verifyToken, isStudent, writeExam);

export default studentRouter;
