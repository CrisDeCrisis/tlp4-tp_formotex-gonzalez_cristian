import "dotenv/config";

const envs = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI,
};

export default envs;
