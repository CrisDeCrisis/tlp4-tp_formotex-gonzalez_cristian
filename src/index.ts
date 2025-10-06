import express from "express";
import morgan from "morgan";
import cors from "cors";
import envs from "./configs/envs.config.js";
import authRouter from "./auth/auth.module.js";
import userRouter from "./user/user.module.js";
import cookieParser from "cookie-parser";
import { ConectionDB } from "./database/ConectionDB.js";
import MongoConfig from "./configs/mongo.config.js";

const app = express();
const PORT = envs.PORT;

// Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.listen(PORT, async () => {
  await ConectionDB.getInstance(new MongoConfig()).connect();
  console.log(`El servidor está corriendo en el puerto: ${PORT}`);
});
