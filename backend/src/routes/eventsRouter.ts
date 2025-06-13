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
 *               name:
 *                 type: string
 *                 description: The title of the event
 *               description:
 *                 type: string
 *                 description: The description of the event
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: The date of the event
 *               location:
 *                type: string
 *                description: The location of the event
 *               classId:
 *                 type: string
 *                 description: The ID of the class level associated with the event
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
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
 *       201:
 *        description: Events retrieved successfully
 *       500:
 *         description: Internal server error
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
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The title of the event
 *               description:
 *                 type: string
 *                 description: The description of the event
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: The date of the event
 *               location:
 *                type: string
 *                description: The location of the event
 *               classId:
 *                 type: string
 *                 description: The ID of the class level associated with the event
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
eventsRouter.put("/:id", verifyToken, isAdmin, updateEvent);

/**
 * @swagger
 * /api/v1/events/{id}:
 *   delete:
 *     summary: Delete a event by ID
 *     tags:
 *      - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: event id
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           format: JWT
 *         description: Token for authorization.
 *     responses:
 *       201:
 *         description: Event deleted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 * */
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
*     responses:
*      200:
*       description: Events retrieved successfully for the specified class level
*      404:
*       description: Class level not found or no events associated with it
*      500:
*       description: Internal server error
 */
eventsRouter.get("/class-level/:classLevelId", getEventsByClassLevel);

export default eventsRouter;
