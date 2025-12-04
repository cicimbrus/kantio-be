// src/routes/openBanking.js
import { Router } from "express";
import { requireInternalSecret } from "../middleware/internalAuth.js";

export const router = Router();

/**
 * INTERNÉ ENDPOINTY – volá ich iba naša Next.js app
 * =================================================
 * Tu vyžadujeme X-Internal-Secret.
 */

router.post("/internal/saltedge/ping", requireInternalSecret, (req, res) => {
  // jednoduchý ping endpoint na otestovanie FE ↔ BE
  res.json({
    ok: true,
    service: "kantio-be",
    provider: "saltedge",
    time: new Date().toISOString(),
  });
});

/**
 * EXTERNÉ ENDPOINTY – volá ich Salt Edge zvonku
 * ============================================
 * Tu NEvyžadujeme internal secret, pretože prídu z internetu.
 */

// callback po úspešnom consente vo fo banke
router.get("/saltedge/callback", (req, res) => {
  console.log("Salt Edge callback query:", req.query);
  // TODO: spracovať query (state, connection_id...), presmerovať usera späť do app
  res.send("Salt Edge callback received. You can close this window.");
});

// webhook s notifikáciami (updated transactions, errors, atď.)
router.post("/saltedge/webhook", (req, res) => {
  console.log("Salt Edge webhook body:", JSON.stringify(req.body, null, 2));
  // TODO: overiť podpis, spracovať event, uložiť do DB
  res.status(200).send("ok");
});
