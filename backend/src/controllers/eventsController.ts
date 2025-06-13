import Events from "../models/Events";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import Admin from "../models/Admin";
import ClassLevel from "../models/ClassLevel";

// Create a new event
const createEvent = async (req: Request, res: Response) => {
  try {
    const { name, description, date, location, classId } = req.body;
    const token = req.headers.token;

    // Validate input
    if (!name || !date || !location) {
      throw new Error("Missing required fields");
    }

    // Check if the admin exists
    const admin = await Admin.findOne({ token });
    if (!admin) {
      throw new Error("Admin not found");
    }

    // Validate classLevels
    const classLevel = await ClassLevel.findOne({ classId });
    if (!classLevel) {
      return res.status(400).json({
        status: "error",
        message: "Invalid class level ID",
      });
    }

    const event = new Events({
      name,
      description,
      date,
      location,
      createdBy: admin._id,
      classLevels: classLevel._id,
      eventId: uuidv4().replace(/-/g, "").slice(0, 14),
    });

    await event.save();

    res.status(201).json({
      status: "success",
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Get all events
const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await Events.find();

    res.status(200).json({
      status: "success",
      data: events,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Get a specific event by ID
const getEventById = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.id;

    const event = await Events.findOne({ eventId });

    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: event,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Update an event
const updateEvent = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.id;
    const { name, description, date, location } = req.body;
    const token = req.headers.token;

    // Check if the admin exists
    const admin = await Admin.findOne({ token });
    if (!admin) {
      throw new Error("Admin not found");
    }

    const event = await Events.findOneAndUpdate(
      { eventId },
      {
        name,
        description,
        date,
        location,
      },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Delete an event
const deleteEvent = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.id;

    const event = await Events.findOneAndDelete({ eventId });

    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Get events by class level
const getEventsByClassLevel = async (req: Request, res: Response) => {
  try {
    const classLevelId = req.params.classLevelId;

    const events = await Events.find({ classLevels: classLevelId });

    if (events.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No events found for this class level",
      });
    }

    res.status(200).json({
      status: "success",
      data: events,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

// Export the functions
export {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByClassLevel,
};
