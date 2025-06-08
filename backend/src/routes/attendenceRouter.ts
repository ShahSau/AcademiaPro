import express from "express";
import verifyToken from "../middlewares/verifyToken";
import isAdmin from "../middlewares/isAdmin";
import {
  createAttendance,
  getAttendanceByClassLevel,
  getAttendanceByStudent,
  getAttendanceByDate,
  updateAttendance,
} from "../controllers/attendenceController";

const attendanceRouter = express.Router();

/**
 * @swagger
 * /api/v1/attendances:
 *   post:
 *     summary: Create a new attendance record
 *     tags:
 *       - Attendance
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
 *               classLevelId:
 *                 type: string
 *                 description: The ID of the class level
 *               studentId:
 *                 type: string
 *                 description: The ID of the student
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: The date of the attendance record
 *               status:
 *                 type: string
 *                 enum: [present, absent, late]
 *                 description: The attendance status of the student
 *     responses:
 *       201:
 *         description: Attendance created successfully
 */
attendanceRouter.post("/", verifyToken, isAdmin, createAttendance);

/**
 * @swagger
 * /api/v1/attendances/class/{classLevelId}:
 *   get:
 *     summary: Get attendance records for a specific class level
 *     tags:
 *       - Attendance
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
 *         name: classLevelId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the class level to get attendance records for
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully
 */
attendanceRouter.get(
  "/class/:classLevelId",
  verifyToken,
  isAdmin,
  getAttendanceByClassLevel
);

/**
 * @swagger
 * /api/v1/attendances/student/{studentId}:
 *   get:
 *     summary: Get attendance records for a specific student
 *     tags:
 *       - Attendance
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
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student to get attendance records for
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully
 */
attendanceRouter.get(
  "/student/:studentId",
  verifyToken,
  isAdmin,
  getAttendanceByStudent
);

/**
 * @swagger
 * /api/v1/attendances/date:
 *   get:
 *     summary: Get attendance records for a specific date
 *     tags:
 *       - Attendance
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
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: The date to get attendance records for
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully
 */
attendanceRouter.get(
  "/date",
  verifyToken,
  isAdmin,
  getAttendanceByDate
);

/**
 * @swagger
 * /api/v1/attendances/{attendanceId}:
 *   put:
 *     summary: Update an attendance record
 *     tags:
 *       - Attendance
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
 *         name: attendanceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the attendance record to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [present, absent, late]
 *                 description: The updated attendance status of the student
 *               remarks:
 *                 type: string
 *                 description: Additional remarks for the attendance record
 *     responses:
 *       200:
 *         description: Attendance record updated successfully
 */
attendanceRouter.put(
  "/:attendanceId",
  verifyToken,
  isAdmin,
  updateAttendance
);

export default attendanceRouter;