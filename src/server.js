import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config.js";
import { router as healthRouter } from "./routes/health.js";
import { router as openBankingRouter } from "./routes/openBanking.js";

const app = express();

// základné middleware
app.use(helmet());
app.use(
  cors({
    origin: config.allowedOrigins,
    credentials: false,
  })
);
app.use(morgan("dev"));
app.use(express.json());

// routy
app.use("/health", healthRouter);
app.use("/open-banking", openBankingRouter);

// fallback 404
app.use((req, res) => {
  res.status(404).json({ error: "not_found" });
});

// spustenie servera
app.listen(config.port, () => {
  console.log(`kantio-be listening on port ${config.port}`);
});
