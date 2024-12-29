import express from "express";
import isAdmin from "../middlewares/isAdmin";
import verifyToken from "../middlewares/verifyToken";
import {
  createYearGroup,
  deleteYearGroup,
  getYearGroup,
  getYearGroups,
  updateYearGroup,
} from "../controllers/yearGroupsController";

const yearGroupRouter = express.Router();

/**
 * @swagger
 * /api/v1/year-groups:
 *   post:
 *     summary: Create a new year group
 *     tags:
 *       - Year Groups
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
 *                 required: true
 *               academicYear:
 *                 type: string
 *                 required: true
 *             example:
 *               name: Year 1
 *               academicYear: 2021/2022
 *     responses:
 *       201:
 *         description: Year group created successfully
 *       400:
 *         description: Error creating year group
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
yearGroupRouter.post("/", verifyToken, isAdmin, createYearGroup);

/**
 * @swagger
 * /api/v1/year-groups:
 *   get:
 *     summary: Get all year groups
 *     tags:
 *       - Year Groups
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
 *         description: Year groups fetched successfully
 *       400:
 *         description: Error fetching year groups
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
yearGroupRouter.get("/", verifyToken, isAdmin, getYearGroups);

/**
 * @swagger
 * /api/v1/year-groups/{id}:
 *   get:
 *     summary: Get a year group by ID
 *     tags:
 *       - Year Groups
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Year group ID
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           format: JWT
 *         description: Token for authorization.
 *     responses:
 *       201:
 *         description: Year group fetched successfully
 *       400:
 *         description: Error fetching year group
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
yearGroupRouter.get("/:id", verifyToken, isAdmin, getYearGroup);

/**
 * @swagger
 * /api/v1/year-groups/{id}:
 *   put:
 *     summary: Update a year group by ID
 *     tags:
 *       - Year Groups
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Year group ID
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
 *                 required: true
 *               academicYear:
 *                 type: string
 *                 required: true
 *             example:
 *               name: Year 1
 *               academicYear: 2021/2022
 *     responses:
 *       201:
 *         description: Year group updated successfully
 *       400:
 *         description: Error updating year group
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
yearGroupRouter.put("/:id", verifyToken, isAdmin, updateYearGroup);

/**
 * @swagger
 * /api/v1/year-groups/{id}:
 *   delete:
 *     summary: Delete a year group by ID
 *     tags:
 *       - Year Groups
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Year group ID
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           format: JWT
 *         description: Token for authorization.
 *     responses:
 *       201:
 *         description: Year group deleted successfully
 *       400:
 *         description: Error deleting year group
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
yearGroupRouter.delete("/:id", verifyToken, isAdmin, deleteYearGroup);

export default yearGroupRouter;
