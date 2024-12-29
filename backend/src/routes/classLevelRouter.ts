import express from "express";
import isAdmin from "../middlewares/isAdmin";
import verifyToken from "../middlewares/verifyToken";
import {
  createClassLevel,
  getClassLevels,
  getClassLevel,
  updateClassLevel,
  deleteClassLevel,
} from "../controllers/classLevelController";

const classLevelRouter = express.Router();

/**
 * @swagger
 * /api/v1/class-levels:
 *   post:
 *     summary: Create a new class level
 *     tags: [Admin]
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
 *                 description: The name of the class level
 *                 example: 100
 *               description:
 *                 type: string
 *                 description: The description of the class level
 *                 example: First year students
 *     responses:
 *       201:
 *         description: Class level created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
classLevelRouter.post("/", verifyToken, isAdmin, createClassLevel);

/**
 * @swagger
 * /api/v1/class-levels:
 *   get:
 *     summary: Get all class levels
 *     tags: [Admin]
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
 *         description: Class levels fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
classLevelRouter.get("/", verifyToken, isAdmin, getClassLevels);

/**
 * @swagger
 * /api/v1/class-levels/{id}:
 *   get:
 *     summary: Get a class level by id
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Class level id
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           format: JWT
 *         description: Token for authorization.
 *     responses:
 *       201:
 *         description: Class level fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
classLevelRouter.get("/:id", verifyToken, isAdmin, getClassLevel);

/**
 * @swagger
 * /api/v1/class-levels/{id}:
 *   put:
 *     summary: Update a class level
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Class level id
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
 *                 description: The name of the class level
 *                 example: 100
 *               description:
 *                 type: string
 *                 description: The description of the class level
 *                 example: First year students
 *     responses:
 *       201:
 *         description: Class level updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
classLevelRouter.put("/:id", verifyToken, isAdmin, updateClassLevel);

/**
 * @swagger
 * /api/v1/class-levels/{id}:
 *   delete:
 *     summary: Delete a class level
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Class level id
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           format: JWT
 *         description: Token for authorization.
 *     responses:
 *       201:
 *         description: Class level deleted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
classLevelRouter.delete("/:id", verifyToken, isAdmin, deleteClassLevel);

export default classLevelRouter;
