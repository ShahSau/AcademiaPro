import express from "express";
import verifyToken from "../middlewares/verifyToken";
import isTeacher from "../middlewares/isTeacher";
import isTeacherORAdmin from "../middlewares/isTeacherORAdmin";
import {
  getExams,
  createExam,
  getExam,
  updateExam,
  changeExamStatus,
} from "../controllers/examController";

const examRouter = express.Router();

/**
 * @swagger
 * /api/v1/exams:
 *   get:
 *     summary: Get all exams
 *     tags:
 *      - Exams
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
 *         description: Exams fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
examRouter.get("/", verifyToken, isTeacherORAdmin, getExams);

/**
 * @swagger
 * /api/v1/exams:
 *   post:
 *     summary: Create a new exam
 *     tags:
 *      - Exams
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
 *                 description: The name of the exam
 *                 example: Midterm Exam
 *               description:
 *                 type: string
 *                 description: The description of the exam
 *                 example: Midterm exam for the 2023/2024 academic year
 *               subjectId:
 *                 type: string
 *                 description: ID of the subject
 *                 example: 60f7d1b7b6f9b3b3b4b3b4b3
 *               passMark:
 *                 type: number
 *                 description: The pass mark for the exam
 *                 example: 50
 *               totalMark:
 *                 type: number
 *                 description: The total mark for the exam
 *                 example: 100
 *               duration:
 *                 type: string
 *                 description: The duration of the exam
 *                 example: 2 hours
 *               examDate:
 *                 type: date
 *                 description: The date of the exam
 *                 example: 2023-10-10
 *               examTime:
 *                 type: string
 *                 description: The time of the exam
 *                 example: 10:00
 *               examStatus:
 *                 type: string
 *                 description: The status of the exam
 *                 example: pending
 *                 allowedValues: [pending, live]
 *               academicTermId:
 *                 type: string
 *                 description: ID of the academic term
 *                 example: 60f7d1b7b6f9b3b3b4b3b4b3
 *               classLevelId:
 *                 type: string
 *                 description: ID of the class level
 *                 example: 60f7d1b7b6f9b3b3b4b3b4b3
 *     responses:
 *       201:
 *         description: Exam created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
examRouter.post("/", verifyToken, isTeacher, createExam);

/**
 * @swagger
 * /api/v1/exams/{id}:
 *   get:
 *     summary: Get exam by ID
 *     tags:
 *      - Exams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           format: JWT
 *         description: Token for authorization.
 *     responses:
 *       200:
 *         description: Exam fetched successfully
 *       404:
 *         description: Exam not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
examRouter.get("/:id", verifyToken, isTeacherORAdmin, getExam);

/**
 * @swagger
 * /api/v1/exams/{id}:
 *   put:
 *     summary: Update exam by ID
 *     tags:
 *      - Exams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
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
 *                 description: The name of the exam
 *                 example: Midterm Exam
 *               description:
 *                 type: string
 *                 description: The description of the exam
 *                 example: Midterm exam for the 2023/2024 academic year
 *               passMark:
 *                 type: number
 *                 description: The pass mark for the exam
 *                 example: 50
 *               totalMark:
 *                 type: number
 *                 description: The total mark for the exam
 *                 example: 100
 *               duration:
 *                 type: string
 *                 description: The duration of the exam
 *                 example: 2 hours
 *               examDate:
 *                 type: date
 *                 description: The date of the exam
 *                 example: 2023-10-10
 *               examTime:
 *                 type: string
 *                 description: The time of the exam
 *                 example: 10:00
 *               examStatus:
 *                 type: string
 *                 description: The status of the exam
 *                 example: pending
 *                 allowedValues: [pending, live]
 *     responses:
 *       200:
 *         description: Exam updated successfully
 *       404:
 *         description: Exam not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
examRouter.put("/:id", verifyToken, isTeacher, updateExam);

/**
 * @swagger
 * /api/v1/exams/{id}/change-status:
 *   put:
 *     summary: Change exam status by ID
 *     tags:
 *      - Exams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           format: JWT
 *         description: Token for authorization.
 *     responses:
 *       200:
 *         description: Exam status updated successfully
 *       404:
 *         description: Exam not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
examRouter.put(
  "/:id/change-status",
  verifyToken,
  isTeacherORAdmin,
  changeExamStatus
);

export default examRouter;
