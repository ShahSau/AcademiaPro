import mongoose, { Schema } from "mongoose";

//exam result schema
const examResultSchema = new mongoose.Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    exam: {
      type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
      ref: "Subject",
    },
    classLevel: {
      type: Schema.Types.ObjectId,
      ref: "ClassLevel",
    },
    academicTerm: {
      type: Schema.Types.ObjectId,
      ref: "AcademicTerm",
      required: true,
    },
    academicYear: {
      type: Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const ExamResult = mongoose.model("ExamResult", examResultSchema);

export default ExamResult;
