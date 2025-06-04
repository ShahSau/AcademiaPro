import mongoose, { Schema } from "mongoose";

const ProgramSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
      default: "4 years",
    },
    code: {
      type: String, // Code will be set dynamically
      required: true,
    },
    createdBy: {
      type: String,
      ref: "Admin",
      required: true,
    },
    teachers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
        default: [],
      },
    ],
    subjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subject",
        default: [],
      },
    ],
    id: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Program = mongoose.model("Program", ProgramSchema);

export default Program;
