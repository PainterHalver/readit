import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import http from "http";
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

// i5-9400f
// loadtest -c 10 --rps 200 http://127.0.0.1:5000/api/posts
// vanilla thread + mongodb: 101 req/s
// cluster:  160 req/s
// cluster + redis:  200 req/s (max)

import { createClient } from "redis";
export const client = createClient({ url: "redis://127.0.0.1:6379" });
client.on("error", console.log);
client.on("connect", function () {
  console.log("REDIS CONNECTED!");
});
const app = express();
import cluster from "cluster";
const numCPUs = require("os").cpus().length;
if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker: any, code: any, _) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(`Worker ${worker.id} crashed. ` + "Starting a new worker...");
      cluster.fork();
    }
  });
} else {
  const port = process.env.PORT || 5000;

  app.locals.server = http.createServer(app);
  app.locals.server.listen(port, async () => {
    console.log(`Worker ${process.pid} started`);

    try {
      await createConnection();
      await client.connect();
      console.log("DATABASE CONNECTED!");
    } catch (err) {
      console.log(err);
    }
  });
}

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
// const whitelist = [
//   "https://readit-calputer.vercel.app",
//   "http://localhost:3000",
//   "http://localhost:5000",
// ];
const corsOptions = {
  credentials: true, // This is important.
  origin: true,
  // optionsSuccessStatus: 200,
};
const corsOpts = cors(corsOptions);
app.use(corsOpts);
app.options("*", corsOpts);

app.use(express.static("public"));

app.get("/api", (_, res) => res.send("Hello World!"));
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/subs", subRouter);
app.use("/api/misc", miscRouter);
app.use("/api/users", userRouter);

app.use(globalErrorHandler);
