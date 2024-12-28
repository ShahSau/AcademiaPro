import express from "express";
import verifyToken from "../middlewares/verifyToken";
import isAdmin from "../middlewares/isAdmin";
import {
  createSubject,
  getSubject,
  getSubjects,
  updateSubject,
} from "../controllers/subjectsController";

const subjectRouter = express.Router();

/**
 * @swagger
 * /api/v1/subjects/{programID}:
 *   post:
 *     tags:
 *       - Subjects
 *     summary: Create a new subject
 *     description: Only admins can create subjects
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: programID
 *         in: path
 *         required: true
 *         description: ID of the program
 *         schema:
 *           type: string
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           format: JWT
 *           description: Token for authorization.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the Subject
 *                 example: Mathematics
 *               description:
 *                 type: string
 *                 description: The description of the subject
 *                 example: The study of numbers and shapes
 *               academicTerm:
 *                 type: string
 *                 description: The academic term of the subject
 *                 example: Fall 2024
 *               duration:
 *                 type: string
 *                 description: The duration of the subject
 *                 example: 3 months
 *     responses:
 *       201:
 *         description: Subject created successfully
 *       400:
 *         description: Error creating subject
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
subjectRouter.post("/:programID", verifyToken, isAdmin, createSubject);

/**
 * @swagger
 * /api/v1/subjects:
 *   get:
 *     tags:
 *       - Subjects
 *     summary: Get all subjects
 *     description: Only admins can get all subjects
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
 *         description: Subjects fetched successfully
 *       400:
 *         description: Error fetching subjects
 *       500:
 *         description: Server error
 */
subjectRouter.get("/", verifyToken, isAdmin, getSubjects);

/**
 * @swagger
 * /api/v1/subjects/{id}:
 *   get:
 *     tags:
 *       - Subjects
 *     summary: Get a subject
 *     description: Only admins can get a subject
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the subject
 *         schema:
 *           type: string
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           format: JWT
 *         description: Token for authorization.
 *     responses:
 *       200:
 *         description: Subject fetched successfully
 *       400:
 *         description: Error fetching subject
 *       500:
 *         description: Server error
 */
subjectRouter.get("/:id", verifyToken, isAdmin, getSubject);

/**
 * @swagger
 * /api/v1/subjects/{id}:
 *   put:
 *     tags:
 *       - Subjects
 *     summary: Update a subject
 *     description: Only admins can update a subject
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the program
 *         schema:
 *           type: string
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
 *                 description: The name of the Subject
 *                 example: Mathematics
 *               description:
 *                 type: string
 *                 description: The description of the subject
 *                 example: The study of numbers and shapes
 *               academicTerm:
 *                 type: string
 *                 description: The academic term of the subject
 *                 example: Fall 2024
 *               duration:
 *                 type: string
 *                 description: The duration of the subject
 *                 example: 3 months
 *     responses:
 *       200:
 *         description: Subject updated successfully
 *       400:
 *         description: Error updating subject
 *       500:
 *         description: Server error
 */
subjectRouter.put("/:id", verifyToken, isAdmin, updateSubject);

export default subjectRouter;
