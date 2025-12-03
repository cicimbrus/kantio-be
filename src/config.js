import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  allowedOrigins: process.env.ALLOWED_ORIGIN
    ? process.env.ALLOWED_ORIGIN.split(",")
    : [],
  internalSecret: process.env.INTERNAL_SECRET || "changeme-in-prod",
};
