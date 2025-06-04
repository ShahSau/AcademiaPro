import mongoose, { Schema } from "mongoose";

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
      type: String, // will be generated later
      unique: true,
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
      type: Schema.Types.ObjectId,
      ref: "Subject",
    },
    program: {
      type: Schema.Types.ObjectId,
    },
    classLevel: {
      type: String,
    },
    academicYear: {
      type: String,
    },
    examsCreated: [
      {
        type: Schema.Types.ObjectId,
        ref: "Exam",
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
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
