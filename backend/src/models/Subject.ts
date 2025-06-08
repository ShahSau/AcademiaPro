import mongoose, { Schema } from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    academicTerm: {
      type: Schema.Types.ObjectId,
      ref: "AcademicTerm",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    duration: {
      type: String,
      required: true,
      default: "3 months",
    },
    programId: {
      type: Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },
    id: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;
