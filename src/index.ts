import express from "express";
import morgan from "morgan";
import cors from "cors";
import envs from "./configs/envs.config.js";
import authRouter from "./auth/auth.module.js";
import userRouter from "./user/user.module.js";
import equipmentRouter from "./equipment/equipment.module.js";
import { ConectionDB } from "./database/ConectionDB.js";
import MongoConfig from "./configs/mongo.config.js";
import { initializeDependencies } from "./configs/dependencies.config.js";

const app = express();
const PORT = envs.PORT;

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initializeDependencies();

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/equipments", equipmentRouter);

app.listen(PORT, async () => {
  await ConectionDB.getInstance(new MongoConfig()).connect();
  console.log(`El servidor está corriendo en el puerto: ${PORT}`);
});
