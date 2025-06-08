import {
  createAcademicYear,
  getAcademicYears,
  getAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
  addStudentsToAcademicYear,
  getStudentsInAcademicYear,
  addTeachersToAcademicYear,
  getTeachersInAcademicYear,
} from "../controllers/academicYearController";
import isAdmin from "../middlewares/isAdmin";
import verifyToken from "../middlewares/verifyToken";

import express from "express";

const academicYearRouter = express.Router();

/**
 * @swagger
 * /api/v1/academic-years:
 *   post:
 *     summary: Create a new academic year
 *     tags:
 *      - Academic Year
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
 *                 description: The name of the academic year
 *                 example: 2023/2024
 *               fromYear:
 *                 type: string
 *                 description: The starting year of the academic year
 *                 example: 2023
 *               toYear:
 *                 type: string
 *                 description: The ending year of the academic year
 *                 example: 2024
 *     responses:
 *       201:
 *         description: Academic year created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
academicYearRouter.post("/", verifyToken, isAdmin, createAcademicYear);

/**
 * @swagger
 * /api/v1/academic-years:
 *   get:
 *     summary: Get all academic years
 *     tags:
 *      - Academic Year
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
 *         description: Academic years fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
academicYearRouter.get("/", verifyToken, isAdmin, getAcademicYears);

/**
 * @swagger
 * /api/v1/academic-years/{id}:
 *   get:
 *     summary: Get a single academic year
 *     tags:
 *      - Academic Year
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Academic year id
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           format: JWT
 *         description: Token for authorization.
 *     responses:
 *       200:
 *         description: Academic year fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
academicYearRouter.get("/:id", verifyToken, isAdmin, getAcademicYear);

/**
 * @swagger
 * /api/v1/academic-years/{id}:
 *   put:
 *     summary: Update an academic year
 *     tags:
 *      - Academic Year
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Academic year id
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
 *                 description: The name of the academic year
 *                 example: 2023/2024
 *               fromYear:
 *                 type: string
 *                 description: The starting year of the academic year
 *                 example: 2023
 *               toYear:
 *                 type: string
 *                 description: The ending year of the academic year
 *                 example: 2024
 *     responses:
 *       200:
 *         description: Academic year updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
academicYearRouter.put("/:id", verifyToken, isAdmin, updateAcademicYear);

/**
 * @swagger
 * /api/v1/academic-years/{id}:
 *   delete:
 *     summary: Delete an academic year
 *     tags:
 *      - Academic Year
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Academic year id
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           format: JWT
 *         description: Token for authorization.
 *     responses:
 *       200:
 *         description: Academic year deleted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
academicYearRouter.delete("/:id", verifyToken, isAdmin, deleteAcademicYear);

/**
 * @swagger
 * /api/v1/academic-years/{id}/students:
 *   post:
 *     summary: Add students to an academic year
 *     tags:
 *      - Academic Year
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Academic year id
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
 *               studentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of student IDs to be added to the academic year
 *                 example: ["studentId1", "studentId2"]
 *     responses:
 *       200:
 *         description: Students added to academic year successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
academicYearRouter.post(
  "/:id/students",
  verifyToken,
  isAdmin,
  addStudentsToAcademicYear
);

/**
 * @swagger
 * /api/v1/academic-years/{id}/students:
 *   get:
 *     summary: Get students in an academic year
 *     tags:
 *      - Academic Year
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Academic year id
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           format: JWT
 *         description: Token for authorization.
 *     responses:
 *       200:
 *         description: Students in the academic year fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
academicYearRouter.get(
  "/:id/students",
  verifyToken,
  isAdmin,
  getStudentsInAcademicYear
);

/**
 * @swagger
 * /api/v1/academic-years/{id}/teachers:
 *   post:
 *     summary: Add teachers to an academic year
 *     tags:
 *      - Academic Year
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Academic year id
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
 *               teacherIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of teacher IDs to be added to the academic year
 *                 example: ["teacherId1", "teacherId2"]
 *     responses:
 *       200:
 *         description: Teachers added to academic year successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
academicYearRouter.post(
  "/:id/teachers",
  verifyToken,
  isAdmin,
  addTeachersToAcademicYear
);

/**
 * @swagger
 * /api/v1/academic-years/{id}/teachers:
 *   get:
 *     summary: Get teachers in an academic year
 *     tags:
 *      - Academic Year
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Academic year id
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           format: JWT
 *         description: Token for authorization.
 *     responses:
 *       200:
 *         description: Teachers in the academic year fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
academicYearRouter.get(
  "/:id/teachers",
  verifyToken,
  isAdmin,
  getTeachersInAcademicYear
);
export default academicYearRouter;
