import mongoose from "mongoose";

const academicTermSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    id:{
      type: String,
      required: true,
      unique: true,
    },
    duration: {
      type: String,
      required: true,
      default: "3 months",
    },
    createdBy: {
      type: String,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

const AcademicTerm = mongoose.model("AcademicTerm", academicTermSchema);

export default AcademicTerm;
