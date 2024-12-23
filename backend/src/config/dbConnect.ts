import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
// Connect to MongoDB and start server
const connectToDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO;
    if (!mongoUri) {
      throw new Error("MONGO environment variable is not defined");
    }
    await mongoose
      .connect(mongoUri)
      .then(() => {
        /* eslint-disable-next-line no-console */
        console.log("Connected to MongoDB");
      })
      .catch((err) => {
        /* eslint-disable-next-line no-console */
        console.log("Error connecting to MongoDB", err);
      });
  } catch (error) {
    /* eslint-disable-next-line no-console */
    console.error("Error connecting to MongoDB", error);
  }
};

export default connectToDB;
