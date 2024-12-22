import express from "express";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
// import authRoutes from "./routes/authRoutes";
import swaggerUI from "swagger-ui-express";
import specs from "./swagger";

dotenv.config();

const app = express();
app.use(express.json());

// Enable CORS
const allowedOrigins = ["http://localhost:3000", "http://localhost:8080"]; // front-end URL should be added here
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

//Swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// app.use("/api/auth", authRoutes);

//health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.send("I am live");
});

// Connect to MongoDB and start server
const startServer = async (): Promise<void> => {
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

startServer();

export default app;
