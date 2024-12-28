import mongoose from "mongoose";

//exam result schema
const examResultSchema = new mongoose.Schema(
  {
    student: {
      type: String,
      ref: "Student",
      required: true,
    },
    exam: {
      type: String,
      ref: "Exam",
      required: true,
    },
    grade: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    passMark: {
      type: Number,
      required: true,
      default: 50,
    },
    //failed/Passed
    status: {
      type: String,
      required: true,
      enum: ["failed", "passed"],
      default: "failed",
    },
    //Excellent/Good/Poor
    remarks: {
      type: String,
      required: true,
      enum: ["Excellent", "Good", "Poor"],
      default: "Poor",
    },
    position: {
      type: Number,
      required: true,
    },

    subject: {
      type: String,
      ref: "Subject",
    },
    classLevel: {
      type: String,
      ref: "ClassLevel",
    },
    academicTerm: {
      type: String,
      ref: "AcademicTerm",
      required: true,
    },
    academicYear: {
      type: String,
      ref: "AcademicYear",
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    id:{
      type: String,
      required: true,
      unique: true,
    }
  },
  {
    timestamps: true,
  }
);

const ExamResult = mongoose.model("ExamResult", examResultSchema);

export default ExamResult;
