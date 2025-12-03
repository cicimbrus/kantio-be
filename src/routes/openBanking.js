import { Router } from "express";

export const router = Router();

// Salt Edge redirect/callback endpoint po consente
router.get("/saltedge/callback", (req, res) => {
  console.log("Salt Edge callback query:", req.query);
  // TODO: spracovať code/state, zavolať Salt Edge API, uložiť connection
  res.send("Salt Edge callback received. You can close this window.");
});

// Webhook endpoint na notifikácie od Salt Edge
router.post("/saltedge/webhook", (req, res) => {
  console.log("Salt Edge webhook body:", req.body);
  // TODO: overiť podpis, spracovať event, uložiť do DB
  res.status(200).send("ok");
});
