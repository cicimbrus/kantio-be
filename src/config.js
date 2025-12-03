// src/config.js
import dotenv from "dotenv";

// dotenv je primárne pre lokálny vývoj (NODE_ENV !== production)
// v produkcii ti premenné dodá systemd cez EnvironmentFile=/etc/kantio/express.env
dotenv.config();

export const config = {
  port: process.env.PORT || 4001,

  // CORS – wildcard pre subdomény (*.kantio.sk)
  allowedOriginSuffix: process.env.ALLOWED_ORIGIN_SUFFIX || null,

  // Ďalšie povolené originy (napr. localhost pri vývoji)
  extraOrigins: process.env.ALLOWED_ORIGIN_EXTRA
    ? process.env.ALLOWED_ORIGIN_EXTRA.split(",")
    : [],

  // Shared secret medzi Next.js a Express backendom
  internalSecret: process.env.INTERNAL_SECRET || null,

  // Salt Edge config – použijeme neskôr pri implementácii integrácie
  saltedge: {
    baseUrl:
      process.env.SALTEDGE_BASE_URL ||
      "https://www.saltedge.com/api/v6",
    appId: process.env.SALTEDGE_APP_ID || "",
    secret: process.env.SALTEDGE_SECRET || "",
  },
};
