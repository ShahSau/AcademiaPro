import mongoose, { Schema } from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    classLevel: {
      type: Schema.Types.ObjectId,
      ref: "ClassLevel",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late"],
      required: true,
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", AttendanceSchema);

export default Attendance;