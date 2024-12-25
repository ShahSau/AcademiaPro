import express from "express";
import verifyToken from "../middlewares/verifyToken";
import isAdmin from "../middlewares/isAdmin";
import {
  createAcademicTerm,
  deleteAcademicTerm,
  getAcademicTerm,
  getAcademicTerms,
  updateAcademicTerms,
} from "../controllers/academicTermController";

const academicTermRouter = express.Router();

/**
 * @swagger
 * /api/v1/academic-terms:
 *   post:
 *     summary: Create a new academic term
 *     tags: [AcademicTerm]
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
 *                 description: The name of the academic term
 *                 example: Fall 2023
 *               description:
 *                 type: string
 *                 description: The description of the academic term
 *                 example: Fall semester of the 2023/2024 academic year
 *               duration:
 *                 type: string
 *                 description: The duration of the academic term
 *                 example: 3 months
 *     responses:
 *       201:
 *         description: Academic term created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
academicTermRouter.post("/", verifyToken, isAdmin, createAcademicTerm);

/**
 * @swagger
 * /api/v1/academic-terms:
 *   get:
 *     summary: Get all academic terms
 *     tags: [AcademicTerm]
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
 *         description: Academic terms fetched successfully
 *       500:
 *         description: Internal server error
 */
academicTermRouter.get("/", verifyToken, isAdmin, getAcademicTerms);

/**
 * @swagger
 * /api/v1/academic-terms/{id}:
 *   get:
 *     summary: Get academic term by ID
 *     tags: [AcademicTerm]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Academic term ID
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           format: JWT
 *         description: Token for authorization.
 *     responses:
 *       200:
 *         description: Academic term fetched successfully
 *       404:
 *         description: Academic term not found
 *       500:
 *         description: Internal server error
 */
academicTermRouter.get("/:id", verifyToken, isAdmin, getAcademicTerm);

/**
 * @swagger
 * /api/v1/academic-terms/{id}:
 *   put:
 *     summary: Update academic term by ID
 *     tags: [AcademicTerm]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Academic term ID
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
 *                 description: The name of the academic term
 *                 example: Fall 2023
 *               description:
 *                 type: string
 *                 description: The description of the academic term
 *                 example: Fall semester of the 2023/2024 academic year
 *               duration:
 *                 type: string
 *                 description: The duration of the academic term
 *                 example: 3 months
 *     responses:
 *       201:
 *         description: Academic term updated successfully
 *       404:
 *         description: Academic term not found
 *       500:
 *         description: Internal server error
 */
academicTermRouter.put("/:id", verifyToken, isAdmin, updateAcademicTerms);

/**
 * @swagger
 * /api/v1/academic-terms/{id}:
 *   delete:
 *     summary: Delete academic term by ID
 *     tags: [AcademicTerm]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Academic term ID
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           format: JWT
 *         description: Token for authorization.
 *     responses:
 *       200:
 *         description: Academic term deleted successfully
 *       404:
 *         description: Academic term not found
 *       500:
 *         description: Internal server error
 */
academicTermRouter.delete("/:id", verifyToken, isAdmin, deleteAcademicTerm);

export default academicTermRouter;
