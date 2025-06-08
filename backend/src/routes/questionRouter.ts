import express from "express";
import verifyToken from "../middlewares/verifyToken";
import isTeacher from "../middlewares/isTeacher";
import {
  createQuestion,
  getQuestion,
  getQuestions,
  updateQuestion,
} from "../controllers/questionsController";
import isAdmin from "../middlewares/isAdmin";

const questionsRouter = express.Router();

/**
 * @swagger
 * /api/v1/questions:
 *   get:
 *     summary: Get all questions
 *     tags: 
 *      - Questions
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
questionsRouter.get("/", verifyToken, isAdmin, getQuestions);

/**
 * @swagger
 * /api/v1/questions/{id}:
 *   get:
 *     summary: Get a question by id
 *     tags: 
 *      - Questions
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
 *         description: Question id
 *     responses:
 *       200:
 *         description: Question fetched successfully
 *       400:
 *         description: Error fetching question
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
questionsRouter.get("/:id", verifyToken, isAdmin, getQuestion);

/**
 * @swagger
 * /api/v1/questions/{examId}:
 *   post:
 *     summary: Create a question
 *     tags: 
 *      - Questions
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
 *         name: examId
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               optionA:
 *                 type: string
 *               optionB:
 *                 type: string
 *               optionC:
 *                 type: string
 *               optionD:
 *                 type: string
 *               correctAnswer:
 *                 type: string
 *     responses:
 *       201:
 *         description: Question created successfully
 *       400:
 *         description: Error creating question
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
questionsRouter.post("/:examId", verifyToken, isTeacher, createQuestion);

/**
 * @swagger
 * /api/v1/questions/{id}:
 *   put:
 *     summary: Update a question
 *     tags: 
 *      - Questions
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
 *         description: Question id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               optionA:
 *                 type: string
 *               optionB:
 *                 type: string
 *               optionC:
 *                 type: string
 *               optionD:
 *                 type: string
 *               correctAnswer:
 *                 type: string
 *     responses:
 *       200:
 *         description: Question updated successfully
 *       400:
 *         description: Error updating question
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
questionsRouter.put("/:id", verifyToken, isTeacher, updateQuestion);

export default questionsRouter;
