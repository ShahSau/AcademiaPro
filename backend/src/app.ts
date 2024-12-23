import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
// import authRoutes from "./routes/authRoutes";
import swaggerUI from "swagger-ui-express";
import specs from "./swagger";
import connectToDB from "./config/dbConnect";
import adminRouter from "./routes/adminRouter";
import academicTermRouter from "./routes/academicTerm";

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

// Routes
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/academic-terms", academicTermRouter);

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     responses:
 *       200:
 *         description: Returns a message indicating the server is live
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: I am live
 */
//health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.send("I am live");
});

// Connect to MongoDB
connectToDB();

export default app;
