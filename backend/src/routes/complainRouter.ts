import express from "express";
import verifyToken from "../middlewares/verifyToken";
import isAdmin from "../middlewares/isAdmin";
import {
  createComplain,
  getComplains,
  getComplain,
  updateComplainStatus,
} from "../controllers/complainController";

const complainRouter = express.Router();

/**
 * @swagger
 * /api/v1/complains:
 *   post:
 *     summary: Create a new complain
 *     tags:
 *      - Complain
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
 *               title:
 *                 type: string
 *                 description: The title of the complain
 *                 example: Issue with the exam schedule
 *               description:
 *                 type: string
 *                 description: Detailed description of the complain
 *                 example: The exam schedule is conflicting with my classes.
 *     responses:
 *       201:
 *         description: Complain created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
complainRouter.post("/", verifyToken, isAdmin, createComplain);

/**
 * @swagger
 * /api/v1/complains:
 *   get:
 *     summary: Get all complains
*     tags:
 *      - Admin
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
 *         description: Complains fetched successfully
 *       401:
 *         description: Unauthorized
 */
complainRouter.get("/", verifyToken, isAdmin, getComplains);

/**
 * @swagger
 * /api/v1/complains/{id}:
 *   get:
 *     summary: Get a specific complain by ID
 *     tags:
 *      - Complain
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
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the complain to retrieve
 *     responses:
 *       200:
 *         description: Complain fetched successfully
 *       404:
 *         description: Complain not found
 */
complainRouter.get("/:id", verifyToken, isAdmin, getComplain);

/**
 * @swagger
 * /api/v1/complains/{id}:
 *   patch:
 *     summary: Update the status of a complain
 *     tags:
 *      - Complain
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
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the complain to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, resolved, dismissed]
 *                 description: The new status of the complain
 *     responses:
 *       200:
 *         description: Complain status updated successfully
 */
complainRouter.patch("/:id", verifyToken, isAdmin, updateComplainStatus);

export default complainRouter;
