import express from "express";
import morgan from "morgan";
import cors from "cors";
import { initializeDependencies } from "./configs/dependencies.config.js";

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initializeDependencies();

const authRouter = (await import("./auth/auth.module.js")).default;
const userRouter = (await import("./user/user.module.js")).default;
const equipmentRouter = (await import("./equipment/equipment.module.js"))
  .default;

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/equipments", equipmentRouter);

export default app;
