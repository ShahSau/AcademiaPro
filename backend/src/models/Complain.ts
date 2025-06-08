import mongoose, { Schema } from "mongoose";

const ComplainSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    accusing:[
        {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true
        }
    ],
    status:{
        type: String,
        enum: ["pending", "resolved", "dismissed"],
        default: "pending",
    }
  },
  { timestamps: true }
);

const Complain = mongoose.model("Complain", ComplainSchema);

export default Complain;