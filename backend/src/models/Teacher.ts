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
      type: String,
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
      ref: "Program",
    },
    classLevel: {
      type: Schema.Types.ObjectId,
      ref: "ClassLevel",
    },
    academicYear: [
      {
        type: Schema.Types.ObjectId,
        ref: "AcademicYear",
      },
    ],
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
    academicTerm: [
      {
        type: Schema.Types.ObjectId,
        ref: "AcademicTerm",
      },
    ],
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
