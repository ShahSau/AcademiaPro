import mongoose from "mongoose";
import type { Document } from "mongoose";

// Define the Student document interface
interface StudentDocument extends Document {
  name: string;
  email: string;
  password: string;
  studentId: string;
  role: string;
  classLevels: string[];
  currentClassLevel?: string;
  academicYear: String;
  dateAdmitted: Date;
  examResults: String[];
  program: String;
  isPromotedToLevel200: boolean;
  isPromotedToLevel300: boolean;
  isPromotedToLevel400: boolean;
  isGraduated: boolean;
  isExpeled: boolean;
  isSuspended: boolean;
  prefectName?: string;
  yearGraduated?: string;
  id: string;
  token: string;
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
    role: {
      type: String,
      default: "student",
    },
    classLevels: [
      {
        type: String,
        ref: "ClassLevel",
      },
    ],
    currentClassLevel: {
      type: String,
    },
    academicYear: {
      type: String,
      ref: "AcademicYear",
    },
    dateAdmitted: {
      type: Date,
      default: Date.now,
    },
    examResults: [
      {
        type: String,
        ref: "ExamResult",
      },
    ],
    program: {
      type: String,
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
    isExpeled: {
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
    id: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Model
const Student = mongoose.model<StudentDocument>("Student", studentSchema);

export default Student;
