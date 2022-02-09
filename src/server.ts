import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

import authRouter from "./routes/authRoutes";
import postRouter from "./routes/postRoutes";
import subRouter from "./routes/subRoutes";
import userRouter from "./routes/userRoutes";
import miscRouter from "./routes/misc";
import trim from "./middlewares/trim";
import globalErrorHandler from "./utils/errorHandler";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(trim);
// app.use(
//   cors({
//     credentials: true,
//     origin: "http://localhost:3000",
//     optionsSuccessStatus: 200,
//   })
// );
const corsOptions = {
  credentials: true, // This is important.
  origin: true,
  optionsSuccessStatus: 200,
};
const corsOpts = cors(corsOptions);
app.use(corsOpts);
app.options("*", corsOpts);

app.listen(port, async () => {
  console.log(`Server running on port ${port}`);

  try {
    await createConnection();
    console.log("DATABASE CONNECTED!");
  } catch (err) {
    console.log(err);
  }
});

app.use(express.static("public"));

app.get("/api", (_, res) => res.send("Hello World!"));
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/subs", subRouter);
app.use("/api/misc", miscRouter);
app.use("/api/users", userRouter);

app.use(globalErrorHandler);
