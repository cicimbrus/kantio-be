// src/middleware/internalAuth.js
import { config } from "../config.js";

/**
 * Middleware, ktorý kontroluje X-Internal-Secret.
 * Použijeme ho len na interné endpointy volané z Next.js,
 * NIE na callbacky/webhooky od Salt Edge (tie sú z vonka).
 */
export function requireInternalSecret(req, res, next) {
  if (!config.internalSecret) {
    console.warn(
      "[kantio-be] INTERNAL_SECRET is not set – internalAuth is effectively disabled."
    );
    return res.status(500).json({ error: "internal_secret_not_configured" });
  }

  const header = req.get("X-Internal-Secret");

  if (!header || header !== config.internalSecret) {
    return res.status(401).json({ error: "unauthorized" });
  }

  return next();
}
