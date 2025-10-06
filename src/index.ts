import app from "./app.js";
import envs from "./configs/envs.config.js";
import { ConectionDB } from "./database/ConectionDB.js";
import MongoConfig from "./configs/mongo.config.js";

const PORT = envs.PORT;

app.listen(PORT, async () => {
  await ConectionDB.getInstance(new MongoConfig()).connect();
  console.log(`El servidor está corriendo en el puerto: ${PORT}`);
});
