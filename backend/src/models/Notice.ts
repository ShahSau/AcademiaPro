import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      ref: "Admin",
      required: true,
    },
    id: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;
