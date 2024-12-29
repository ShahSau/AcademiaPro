import express from "express";
import verifyToken from "../middlewares/verifyToken";
import isAdmin from "../middlewares/isAdmin";
import {
  createNotice,
  getNotices,
  getNotice,
  updateNotice,
  deleteNotice,
} from "../controllers/noticeController";

const noticeRouter = express.Router();

/**
 * @swagger
 * /api/v1/notices:
 *   post:
 *     summary: Create a notice
 *     tags:
 *       - Admin
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
 *                 required: true
 *               details:
 *                 type: string
 *                 required: true
 *               date:
 *                 type: string
 *                 required: true
 *             example:
 *               title: Notice 1
 *               details: This is a notice for all students and staff
 *               date: 2021-09-01
 *     responses:
 *       201:
 *         description: Notice created successfully
 *       400:
 *         description: Error occurred
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
noticeRouter.post("/", verifyToken, isAdmin, createNotice);

/**
 * @swagger
 * /api/v1/notices:
 *   get:
 *     summary: Get all notices
 *     tags:
 *       - Admin
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
 *         description: Notices fetched successfully
 *       400:
 *         description: Error fetching notices
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
noticeRouter.get("/", verifyToken, isAdmin, getNotices);

/**
 * @swagger
 * /api/v1/notices/{id}:
 *   get:
 *     summary: Get a notice by id
 *     tags:
 *       - Admin
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
 *         description: Notice id
 *     responses:
 *       200:
 *         description: Notice fetched successfully
 *       400:
 *         description: Error fetching notice
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
noticeRouter.get("/:id", verifyToken, isAdmin, getNotice);

/**
 * @swagger
 * /api/v1/notices/{id}:
 *   put:
 *     summary: Update a notice by id
 *     tags:
 *       - Admin
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
 *         description: Notice id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 required: true
 *               details:
 *                 type: string
 *                 required: true
 *               date:
 *                 type: string
 *                 required: true
 *             example:
 *               title: Notice 1
 *               details: This is a notice for all students and staff
 *               date: 2021-09-01
 *     responses:
 *       200:
 *         description: Notice updated successfully
 *       400:
 *         description: Error updating notice
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
noticeRouter.put("/:id", verifyToken, isAdmin, updateNotice);

/**
 * @swagger
 * /api/v1/notices/{id}:
 *   delete:
 *     summary: Delete a notice by id
 *     tags:
 *       - Admin
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
 *         description: Notice id
 *     responses:
 *       200:
 *         description: Notice deleted successfully
 *       400:
 *         description: Error deleting notice
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
noticeRouter.delete("/:id", verifyToken, isAdmin, deleteNotice);

export default noticeRouter;
