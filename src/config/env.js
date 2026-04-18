import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/helplytics_ai",
  jwtSecret: process.env.JWT_SECRET || "dev-secret",
};
