// src/server.js
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config.js";
import { router as healthRouter } from "./routes/health.js";
import { router as openBankingRouter } from "./routes/openBanking.js";

const app = express();

// ───────────────── základné middleware ─────────────────

app.use(helmet());

// CORS s podporou multi-tenant *.kantio.sk
app.use(
  cors({
    origin: (origin, callback) => {
      // 1) server-side volania (žiadny Origin header) → povolíme
      if (!origin) {
        return callback(null, true);
      }

      let hostname;
      try {
        const url = new URL(origin);
        hostname = url.hostname;
      } catch (e) {
        return callback(new Error("Not allowed by CORS"));
      }

      // 2) extra originy z env (napr. http://localhost:3000)
      if (config.extraOrigins.includes(origin)) {
        return callback(null, true);
      }

      // 3) wildcard: *.kantio.sk (tenanty, app.kantio.sk, admin.kantio.sk, atď.)
      if (
        config.allowedOriginSuffix &&
        hostname.endsWith(config.allowedOriginSuffix)
      ) {
        return callback(null, true);
      }

      // 4) inak zamietnuť
      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(morgan("dev"));
app.use(express.json());

// Jemné varovanie, ak chýba INTERNAL_SECRET
if (!config.internalSecret) {
  // nechceme kvôli tomu spadnúť, ale v logu to má byť vidno
  console.warn(
    "[kantio-be] WARNING: INTERNAL_SECRET is not set. " +
      "Internal API calls should be protected as soon as possible."
  );
}

// ───────────────── routy ─────────────────

app.use("/health", healthRouter);
app.use("/open-banking", openBankingRouter);

// fallback 404
app.use((req, res) => {
  res.status(404).json({ error: "not_found" });
});

// ───────────────── štart servera ─────────────────

app.listen(config.port, () => {
  console.log(
    `kantio-be listening on port ${config.port} (origin suffix: ${config.allowedOriginSuffix || "none"})`
  );
});
