import mongoose from "mongoose";

//examSchema
const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      ref: "Subject",
      required: true,
    },
    program: {
      type: String,
      ref: "Program",
      required: true,
    },
    passMark: {
      type: Number,
      required: true,
      default: 50,
    },
    totalMark: {
      type: Number,
      required: true,
      default: 100,
    },

    academicTerm: {
      type: String,
      ref: "AcademicTerm",
      required: true,
    },
    duration: {
      type: String,
      required: true,
      default: "30 minutes",
    },
    examDate: {
      type: Date,
      required: true,
      default: new Date(),
    },
    examTime: {
      type: String,
      required: true,
    },
    examType: {
      type: String,
      required: true,
      default: "Quiz",
      enum: ["Quiz", "Exam"],
    },
    examStatus: {
      type: String,
      required: true,
      default: "pending",
      enum: ["pending", "live"],
    },
    questions: [
      {
        type: String,
        ref: "Question",
      },
    ],
    classLevel: {
      type: String,
      ref: "ClassLevel",
      required: true,
    },
    createdBy: {
      type: String,
      ref: "Teacher",
      required: true,
    },
    academicYear: {
      type: String,
      ref: "AcademicYear",
      required: true,
    },
    resultPublished: {
      type: Boolean,
      required: true,
      default: false,
    },
    id:{
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
);

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
