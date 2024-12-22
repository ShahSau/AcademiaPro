import mongoose from "mongoose";
import type { Document } from "mongoose";

// Define the Student document interface
interface StudentDocument extends Document {
  name: string;
  email: string;
  password: string;
  studentId: string;
  role: string;
  classLevels: mongoose.Types.ObjectId[];
  currentClassLevel?: string;
  academicYear: mongoose.Types.ObjectId;
  dateAdmitted: Date;
  examResults: mongoose.Types.ObjectId[];
  program: mongoose.Types.ObjectId;
  isPromotedToLevel200: boolean;
  isPromotedToLevel300: boolean;
  isPromotedToLevel400: boolean;
  isGraduated: boolean;
  isWithdrawn: boolean;
  isSuspended: boolean;
  prefectName?: string;
  yearGraduated?: string;
}

// Define the schema
const studentSchema = new mongoose.Schema<StudentDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "student",
    },
    classLevels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClassLevel",
      },
    ],
    currentClassLevel: {
      type: String,
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
    },
    dateAdmitted: {
      type: Date,
      default: Date.now,
    },
    examResults: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExamResult",
      },
    ],
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
    },
    isPromotedToLevel200: {
      type: Boolean,
      default: false,
    },
    isPromotedToLevel300: {
      type: Boolean,
      default: false,
    },
    isPromotedToLevel400: {
      type: Boolean,
      default: false,
    },
    isGraduated: {
      type: Boolean,
      default: false,
    },
    isWithdrawn: {
      type: Boolean,
      default: false,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    prefectName: {
      type: String,
    },
    yearGraduated: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to generate `studentId`
studentSchema.pre<StudentDocument>("save", function (next) {
  if (!this.studentId) {
    this.studentId =
      "STU" +
      Math.floor(100 + Math.random() * 900) +
      Date.now().toString().slice(2, 4) +
      this.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase();
  }

  // Set currentClassLevel based on the last element in classLevels
  if (this.classLevels && this.classLevels.length > 0) {
    this.currentClassLevel =
      this.classLevels[this.classLevels.length - 1].toString();
  }

  next();
});

// Model
const Student = mongoose.model<StudentDocument>("Student", studentSchema);

export default Student;
