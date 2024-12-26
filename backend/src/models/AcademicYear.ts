import mongoose from "mongoose";

const academicYearSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    fromYear: {
      type: Date,
      required: true,
    },
    toYear: {
      type: Date,
      required: true,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String,
      ref: "Admin",
      required: true,
    },
    students: [
      {
        type: String,
        ref: "Student",
      },
    ],
    teachers: [
      {
        type: String,
        ref: "Teacher",
      },
    ],
    id:{
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true,
  }
);

//model
const AcademicYear = mongoose.model("AcademicYear", academicYearSchema);

export default AcademicYear;
