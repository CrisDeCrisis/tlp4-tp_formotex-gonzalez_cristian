import express from "express";
import morgan from "morgan";
import cors from "cors";
import envs from "./configs/envs.config.js";
import authRouter from "./auth/routers/auth.routes.js";
import { ConectionDB } from "./database/ConectionDB.js";
import MongoConfig from "./configs/mongo.config.js";

const app = express();
const PORT = envs.PORT;

// Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use(authRouter);

app.listen(PORT, async () => {
  await ConectionDB.getInstance(new MongoConfig()).connect();
  console.log(`El servidor está corriendo en el puerto: ${PORT}`);
});
