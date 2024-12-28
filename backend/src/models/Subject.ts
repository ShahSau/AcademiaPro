import mongoose from "mongoose";

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
      type: String,
      ref: "Teacher",
    },
    academicTerm: {
      type: String,
      ref: "AcademicTerm",
      required: true,
    },
    createdBy: {
      type: String,
      ref: "Admin",
      required: true,
    },
    duration: {
      type: String,
      required: true,
      default: "3 months",
    },
    programId: {
      type: String,
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
