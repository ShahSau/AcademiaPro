import mongoose from "mongoose";

const yearGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      ref: "Admin",
      required: true,
    },
    academicYear: {
      type: Object,
      ref: "AcademicYear",
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//model
const YearGroup = mongoose.model("YearGroup", yearGroupSchema);

export default YearGroup;
