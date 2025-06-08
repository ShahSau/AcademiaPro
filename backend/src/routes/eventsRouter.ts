import express from "express";
import verifyToken from "../middlewares/verifyToken";
import isAdmin from "../middlewares/isAdmin";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByClassLevel,
} from "../controllers/eventsController";

const eventsRouter = express.Router();

/**
 * @swagger
 * /api/v1/events:
 *   post:
 *     summary: Create a new event
 *     tags:
 *       - Events
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
 *                 description: The title of the event
 *               description:
 *                 type: string
 *                 description: The description of the event
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: The date of the event
 *               classLevels:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: The IDs of the class levels associated with the event
 */
eventsRouter.post("/", verifyToken, isAdmin, createEvent);

/**
 * @swagger
 * /api/v1/events:
 *   get:
 *     summary: Get all events
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: A list of events
 */
eventsRouter.get("/", getAllEvents);

/**
 * @swagger
 * /api/v1/events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event
 */
eventsRouter.get("/:id", getEventById);

/**
 * @swagger
 * /api/v1/events/{id}:
 *   put:
 *     summary: Update an event
 *     tags:
 *       - Events
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
 *         description: The ID of the event to update
 */
eventsRouter.put("/:id", verifyToken, isAdmin, updateEvent);

/**
 * @swagger
 * /api/v1/events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags:
 *       - Events
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
 *         description: The ID of the event to delete
 */
eventsRouter.delete("/:id", verifyToken, isAdmin, deleteEvent);

/**
 * @swagger
 * /api/v1/events/class-level/{classLevelId}:
 *   get:
 *     summary: Get events by class level
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: classLevelId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the class level to filter events by
 */
eventsRouter.get("/class-level/:classLevelId", getEventsByClassLevel);

export default eventsRouter;
