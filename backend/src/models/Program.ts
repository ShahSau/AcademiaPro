import mongoose from "mongoose";

const ProgramSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
      default: "4 years",
    },
    code: {
      type: String, // Code will be set dynamically
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        default: [],
      },
    ],
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

// Pre-save middleware to generate the `code`
ProgramSchema.pre("save", function (next) {
  if (!this.code) {
    this.code =
      this.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase() +
      Math.floor(10 + Math.random() * 90) +
      Math.floor(10 + Math.random() * 90);
  }
  next();
});

const Program = mongoose.model("Program", ProgramSchema);

module.exports = Program;
