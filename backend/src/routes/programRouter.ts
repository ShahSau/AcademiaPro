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
} from "../controllers/programsController";

const programRouter = express.Router();

/**
 * @swagger
 * /api/v1/programs:
 *   post:
 *     tags:
 *       - Admin
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
 *  get:
 *    tags:
 *      - Admin
 *    summary: Get all programs
 *    description: Only admins can fetch all programs
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: header
 *        name: token
 *        required: true
 *        schema:
 *          type: string
 *          format: JWT
 *        description: Token for authorization.
 *    responses:
 *      201:
 *        description: Programs fetched successfully
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
programRouter.get("/", verifyToken, isAdmin, getPrograms);

/**
 * @swagger
 * /api/v1/programs/{id}:
 *   get:
 *     tags:
 *       - Admin
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
 *       - Admin
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
 *       - Admin
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

export default programRouter;
