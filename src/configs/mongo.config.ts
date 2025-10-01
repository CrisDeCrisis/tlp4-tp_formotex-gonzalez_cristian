import type { IDatabase } from "../database/interfaces/IDatabase.js";
import mongoose from "mongoose";
import envs from "./envs.config.js";

export default class MongoConfig implements IDatabase {
  public async connect(): Promise<void> {
    try {
      await mongoose.connect(envs.MONGO_URI!);
      console.log(`Conectado a MongoDB`);
    } catch (err) {
      console.error(`Error al conectar a MongoDB: ${err}`);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log(`Desconectado de MongoDB`);
    } catch (err) {
      console.error(`Error al desconectar de MongoDB: ${err}`);
    }
  }
}
