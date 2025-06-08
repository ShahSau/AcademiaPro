import Events from "../models/Events";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Types } from "mongoose";
import Admin from "../models/Admin";
import Teacher from "../models/Teacher";

// Create a new event
const createEvent = async (req: Request, res: Response) => {
  try {
    const { name, description, date, location, classLevels } = req.body;
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

    const event = new Events({
      name,
      description,
      date,
      location,
      createdBy: admin._id,
      classLevels: classLevels.map((id: string) => new Types.ObjectId(id)),
      id: uuidv4().replace(/-/g, "").slice(0, 14),
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
}

// Get all events
const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await Events.find().populate("createdBy", "name email").populate("classLevels", "name");

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
}

// Get a specific event by ID
const getEventById = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.id;

    // Validate eventId
    if (!Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid event ID",
      });
    }

    const event = await Events.findById(eventId)
      .populate("createdBy", "name email")
      .populate("classLevels", "name");

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
}

// Update an event
const updateEvent = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.id;
    const { name, description, date, location, classLevels } = req.body;
    const token = req.headers.token;

    // Validate eventId
    if (!Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid event ID",
      });
    }

    // Check if the admin exists
    const admin = await Admin.findOne({ token });
    if (!admin) {
      throw new Error("Admin not found");
    }

    const event = await Events.findByIdAndUpdate(
      eventId,
      {
        name,
        description,
        date,
        location,
        createdBy: admin._id,
        classLevels: classLevels.map((id: string) => new Types.ObjectId(id)),
      },
      { new: true }
    ).populate("createdBy", "name email").populate("classLevels", "name");

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
}

// Delete an event
const deleteEvent = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.id;

    // Validate eventId
    if (!Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid event ID",
      });
    }

    const event = await Events.findByIdAndDelete(eventId);

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
}

// Get events by class level
const getEventsByClassLevel = async (req: Request, res: Response) => {
  try {
    const classLevelId = req.params.classLevelId;

    // Validate classLevelId
    if (!Types.ObjectId.isValid(classLevelId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid class level ID",
      });
    }

    const events = await Events.find({ classLevels: classLevelId })
      .populate("createdBy", "name email")
      .populate("classLevels", "name");

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
}

// Export the functions
export {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByClassLevel,
};
