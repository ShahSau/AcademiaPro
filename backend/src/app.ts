import express from "express";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import specs from "./swagger";
import connectToDB from "./config/dbConnect";
import adminRouter from "./routes/adminRouter";
import academicTermRouter from "./routes/academicTermRouter";
import academicYearRouter from "./routes/academicYearRouter";
import classLevelRouter from "./routes/classLevelRouter";
import examRouter from "./routes/examRouter";
import programRouter from "./routes/programRouter";
import studentRouter from "./routes/studentRouter";
import subjectRouter from "./routes/subjectsRouter";
import teacherRouter from "./routes/teacherRouter";
import yearGroupRouter from "./routes/yearGroupsRouter";
import { globalErrHandler, notFoundErr } from "./middlewares/globalErrHandler";
import noticeRouter from "./routes/noticeRouter";
import complainRouter from "./routes/complainRouter";
import attendanceRouter from "./routes/attendenceRouter";
import eventsRouter from "./routes/eventsRouter";

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
app.use("/api/v1/teachers", teacherRouter);
app.use("/api/v1/academic-terms", academicTermRouter);
app.use("/api/v1/academic-years", academicYearRouter);
app.use("/api/v1/year-groups", yearGroupRouter);
app.use("/api/v1/programs", programRouter);
app.use("/api/v1/subjects", subjectRouter);
app.use("/api/v1/class-levels", classLevelRouter);
app.use("/api/v1/events", eventsRouter);
app.use("/api/v1/exams", examRouter);
//exam result 
// use this in here 
// const changeResultStatus = async (req: Request, res: Response) => {
//   const id = req.params.id;

//   if (!id) {
//     return res.status(400).json({ message: "Exam ID is required" });
//   }

//   try {
//     const exam = await Exam.findOne({ id });

//     if (!exam) {
//       return res.status(400).json({ message: "Exam does not exists" });
//     }

//     await Exam.updateOne(
//       { id },
//       {
//         ...exam,
//         resultPublished: !exam.resultPublished,
//       }
//     );

//     res
//       .status(200)
//       .json({ message: "Exam results status updated successfully" });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error changing exam result status",
//       error: (error as Error).message,
//     });
//   }
// };

app.use("/api/v1/students", studentRouter);
app.use("/api/v1/notices", noticeRouter);
app.use("/api/v1/complains", complainRouter);
app.use("/api/v1/attendance", attendanceRouter);

//Error middlewares
app.use(notFoundErr);
app.use(globalErrHandler);

// Connect to MongoDB
connectToDB();

export default app;
