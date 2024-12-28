import {
  createAcademicYear,
  getAcademicYears,
  getAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
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
 *     tags: [AcademicYear]
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
 *     tags: [AcademicYear]
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
 *     tags: [AcademicYear]
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
 *     tags: [AcademicYear]
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
 *     tags: [AcademicYear]
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

export default academicYearRouter;
