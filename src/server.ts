import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

import authRouter from "./routes/authRoutes";
import postRouter from "./routes/postRoutes";
import subRouter from "./routes/subRoutes";
import trim from "./middlewares/trim";
import globalErrorHandler from "./utils/errorHandler";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("dev"));
app.use(trim);
app.use(cookieParser());

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.listen(port, async () => {
  console.log(`Server running on port ${port}`);

  try {
    await createConnection();
    console.log("DATABASE CONNECTED!");
  } catch (err) {
    console.log(err);
  }
});

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/posts", subRouter);

app.use(globalErrorHandler);
