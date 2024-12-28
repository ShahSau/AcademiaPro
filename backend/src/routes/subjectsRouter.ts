import express from "express";
import verifyToken from "../middlewares/verifyToken";
import isAdmin from "../middlewares/isAdmin";
import {
  createSubject,
  getSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               teacher:
 *                 type: string
 *               academicTerm:
 *                 type: string
 *               createdBy:
 *                 type: string
 *               duration:
 *                 type: string
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
 *     responses:
 *       200:
 *         description: Subject updated successfully
 *       400:
 *         description: Error updating subject
 *       500:
 *         description: Server error
 */
subjectRouter.put("/:id", verifyToken, isAdmin, updateSubject);

/**
 * @swagger
 * /api/v1/subjects/{id}:
 *   delete:
 *     tags:
 *       - Subjects
 *     summary: Delete a subject
 *     description: Only admins can delete a subject
 *     responses:
 *       200:
 *         description: Subject deleted successfully
 *       400:
 *         description: Error deleting subject
 *       500:
 *         description: Server error
 */
subjectRouter.delete("/:id", verifyToken, isAdmin, deleteSubject);

export default subjectRouter;
