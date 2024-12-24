import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
// import authRoutes from "./routes/authRoutes";
import swaggerUI from "swagger-ui-express";
import specs from "./swagger";
import connectToDB from "./config/dbConnect";
import adminRouter from "./routes/adminRouter";
import academicTermRouter from "./routes/academicTerm";
import academicYearRouter from "./routes/academicYear";
import classLevelRouter from "./routes/classLevel";
import examResultRouter from "./routes/examRsultsRoute";
import examRouter from "./routes/examRoutes";
import programRouter from "./routes/program";
import questionsRouter from "./routes/questionRoutes";
import studentRouter from "./routes/studentRouter";
import subjectRouter from "./routes/subjectsRouter";
import teacherRouter from "./routes/teacherRouter";
import yearGroupRouter from "./routes/yearGroups";
import { globalErrHandler, notFoundErr } from "./middlewares/globalErrHandler";

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
app.use("/api/v1/academic-years", academicYearRouter);
app.use("/api/v1/academic-terms", academicTermRouter);
app.use("/api/v1/class-levels", classLevelRouter);
app.use("/api/v1/programs", programRouter);
app.use("/api/v1/subjects", subjectRouter);
app.use("/api/v1/year-groups", yearGroupRouter);
app.use("/api/v1/teachers", teacherRouter);
app.use("/api/v1/exams", examRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/questions", questionsRouter);
app.use("/api/v1/exam-results", examResultRouter);

//Error middlewares
app.use(notFoundErr);
app.use(globalErrHandler);
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
