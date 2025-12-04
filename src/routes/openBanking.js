// src/routes/openBanking.js
import { Router } from "express";
import { requireInternalSecret } from "../middleware/internalAuth.js";
import {
  seGetProviders,
  seCreateCustomer,
  seCreateConnection,
} from "../services/saltedgeClient.js";

export const router = Router();

/**
 * INTERNÉ ENDPOINTY – volá ich iba naša Next.js app (cez X-Internal-Secret)
 * ========================================================================
 */

router.post("/internal/saltedge/ping", requireInternalSecret, (req, res) => {
  res.json({
    ok: true,
    service: "kantio-be",
    provider: "saltedge",
    time: new Date().toISOString(),
  });
});

/**
 * Debug endpoint – vráti zoznam providerov (banky) zo Salt Edge.
 * Neskôr ho môžeš buď vypnúť, alebo použiť na select box v UI.
 */
router.get(
  "/internal/saltedge/providers",
  requireInternalSecret,
  async (req, res) => {
    try {
      const providers = await seGetProviders({
        // príklad: country_code: "sk"
        // country_code: "sk",
      });

      // Môžeme to trocha osekať pre FE:
      const simplified = providers.map((p) => ({
        id: p.id,
        code: p.code,
        name: p.name,
        country_code: p.country_code,
        mode: p.mode,
        holder_info_required: p.holder_info_required,
      }));

      res.json({ ok: true, providers: simplified });
    } catch (err) {
      console.error("saltedge providers error:", err);
      res.status(500).json({
        ok: false,
        error: err.message || "saltedge_providers_failed",
      });
    }
  }
);

/**
 * EXTERNÉ ENDPOINTY – volá ich Salt Edge zvonku (callback + webhook)
 * =================================================================
 */

// callback po úspešnom consente v banke
router.get("/saltedge/callback", (req, res) => {
  console.log("Salt Edge callback query:", req.query);
  // TODO: spracovať query (state, connection_id...), nájsť tenant/connection,
  // update BankConnection v DB, redirect usera späť do FE.
  res.send("Salt Edge callback received. You can close this window.");
});

// webhook s notifikáciami (updated transactions, errors, atď.)
router.post("/saltedge/webhook", (req, res) => {
  console.log("Salt Edge webhook body:", JSON.stringify(req.body, null, 2));
  // TODO: overiť podpis, spracovať eventy, zaktualizovať DB
  res.status(200).send("ok");
});
