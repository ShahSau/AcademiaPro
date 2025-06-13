import express from "express";
import verifyToken from "../middlewares/verifyToken";
import isAdmin from "../middlewares/isAdmin";
import {
  // addSubjectToProgram,
  createProgram,
  deleteProgram,
  getProgram,
  getPrograms,
  updateProgram,
  addTeachersToProgram,
  addStudentsToProgram,
  getTeachersInProgram,
  getStudentsInProgram,
  getSubjectsInProgram,
} from "../controllers/programsController";

const programRouter = express.Router();

/**
 * @swagger
 * /api/v1/programs:
 *   post:
 *     tags:
 *      - Programs
 *     summary: Create a new program
 *     description: Only admins can create programs
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
 *                 description: The name of the program
 *                 example: Computer Science
 *               description:
 *                 type: string
 *                 description: The description of the program
 *                 example: The study of computers and computational systems
 *               duration:
 *                 type: string
 *                 description: The duration of the program
 *                 example: 4 years
 *     responses:
 *       201:
 *         description: Program created successfully
 *       400:
 *         description: Error creating program
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
programRouter.post("/", verifyToken, isAdmin, createProgram);

/**
 * @swagger
 * /api/v1/programs:
 *   get:
 *     tags:
 *      - Programs
 *     summary: Get all programs
 *     description: Only admins can get a program
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
 *       201:
 *         description: Program fetched successfully
 *       400:
 *         description: Error fetching program
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
programRouter.get("/", verifyToken, isAdmin, getPrograms);

/**
 * @swagger
 * /api/v1/programs/{id}:
 *   get:
 *     tags:
 *      - Programs
 *     summary: Get a program
 *     description: Only admins can get a program
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
 *     responses:
 *       201:
 *         description: Program fetched successfully
 *       400:
 *         description: Error fetching program
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
programRouter.get("/:id", verifyToken, isAdmin, getProgram);

/**
 * @swagger
 * /api/v1/programs/{id}:
 *   put:
 *     tags:
 *      - Programs
 *     summary: Update a program
 *     description: Only admins can update a program
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
 *                 description: The name of the program
 *                 example: Computer Science
 *               description:
 *                 type: string
 *                 description: The description of the program
 *                 example: The study of computers and computational systems
 *               duration:
 *                 type: string
 *                 description: The duration of the program
 *                 example: 4 years
 *     responses:
 *       201:
 *         description: Program updated successfully
 *       400:
 *         description: Error updating program
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
programRouter.put("/:id", verifyToken, isAdmin, updateProgram);

/**
 * @swagger
 * /api/v1/programs/{id}:
 *   delete:
 *     tags:
 *      - Programs
 *     summary: Delete a program
 *     description: Only admins can delete a program
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
 *     responses:
 *       201:
 *         description: Program deleted successfully
 *       400:
 *         description: Error deleting program
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
programRouter.delete("/:id", verifyToken, isAdmin, deleteProgram);

/**
 * @swagger
 * /api/v1/programs/{id}/teachers:
 *   post:
 *     tags:
 *      - Programs
 *     summary: Add teachers to a program
 *     description: Only admins can add teachers to a program
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
 *               teacherIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of teacher IDs to add to the program
 *                 example: ["60c72b2f9b1d8c001c8e4f1a", "60c72b2f9b1d8c001c8e4f1b"]
 *     responses:
 *       201:
 *         description: Teachers added to program successfully
 *       400:
 *         description: Error adding teachers to program
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Program not found
 *       500:
 *         description: Server error
 */
programRouter.post("/:id/teachers", verifyToken, isAdmin, addTeachersToProgram);

/**
 * @swagger
 * /api/v1/programs/{id}/students:
 *   post:
 *     tags:
 *      - Programs
 *     summary: Add students to a program
 *     description: Only admins can add students to a program
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
 *               studentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of student IDs to add to the program
 *                 example: ["60c72b2f9b1d8c001c8e4f1a", "60c72b2f9b1d8c001c8e4f1b"]
 *     responses:
 *       201:
 *         description: students added to program successfully
 *       400:
 *         description: Error adding students to program
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Program not found
 *       500:
 *         description: Server error
 */
programRouter.post("/:id/students", verifyToken, isAdmin, addStudentsToProgram);

/**
 * @swagger
 * /api/v1/programs/{id}/teachers:
 *   get:
 *     tags:
 *      - Programs
 *     summary: Get all teachers in a program
 *     description: Only admins can get all teachers in a program
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
 *     responses:
 *       201:
 *         description: Teachers fetched successfully
 *       400:
 *         description: Error fetching teachers
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Program not found
 *       500:
 *         description: Server error
 */
programRouter.get("/:id/teachers", verifyToken, isAdmin, getTeachersInProgram);

/**
 * @swagger
 * /api/v1/programs/{id}/students:
 *   get:
 *     tags:
 *      - Programs
 *     summary: Get all students in a program
 *     description: Only admins can get all students in a program
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
 *     responses:
 *       201:
 *         description: Students fetched successfully
 *       400:
 *         description: Error fetching students
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Program not found
 *       500:
 *         description: Server error
 */
programRouter.get("/:id/students", verifyToken, isAdmin, getStudentsInProgram);

/**
 * @swagger
 * /api/v1/programs/{id}/subjects:
 *   get:
 *     tags:
 *      - Programs
 *     summary: Get all subjects in a program
 *     description: Only admins can get all subjects in a program
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
 *     responses:
 *       201:
 *         description: Students fetched successfully
 *       400:
 *         description: Error fetching students
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Program not found
 *       500:
 *         description: Server error
 */
programRouter.get("/:id/subjects", verifyToken, isAdmin, getSubjectsInProgram);

export default programRouter;
