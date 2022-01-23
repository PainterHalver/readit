import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgan from "morgan";

import authRouter from "./routes/auth";
import trim from "./middlewares/trim";
import globalErrorHandler from "./utils/errorHandler";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(trim);

app.get("/", (_, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT || 3000;

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

app.use(globalErrorHandler);
