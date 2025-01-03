import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    dateEmployed: {
      type: Date,
      default: Date.now,
    },
    teacherId: {
      type: String,
      required: true,
    },
    employedCurrently: {
      type: Boolean,
      default: true,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "teacher",
    },
    subject: {
      type: String,
      ref: "Subject",
    },
    program: {
      type: String,
    },
    classLevel: {
      type: String,
    },
    academicYear: {
      type: String,
    },
    examsCreated: [
      {
        type: String,
        ref: "Exam",
      },
    ],
    createdBy: {
      type: String,
      ref: "Admin",
    },
    academicTerm: {
      type: String,
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//model
const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;
