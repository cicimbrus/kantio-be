// src/services/saltedgeClient.js
import { config } from "../config.js";

const BASE_URL = process.env.SALTEDGE_BASE_URL;
const APP_ID = process.env.SALTEDGE_APP_ID;
const SECRET = process.env.SALTEDGE_SECRET;

if (!BASE_URL || !APP_ID || !SECRET) {
  console.warn(
    "[saltedge] Missing SALTEDGE_BASE_URL / SALTEDGE_APP_ID / SALTEDGE_SECRET in env – Salt Edge client will not work properly."
  );
}

/**
 * Interná helper funkcia na volanie Salt Edge API.
 */
async function saltedgeRequest(path, { method = "GET", body } = {}) {
  if (!BASE_URL || !APP_ID || !SECRET) {
    throw new Error("Salt Edge env vars not configured");
  }

  const url = `${BASE_URL}${path}`;

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "App-id": APP_ID,
    "Secret": SECRET,
  };

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json;

  try {
    json = text ? JSON.parse(text) : null;
  } catch (e) {
    throw new Error(
      `Salt Edge response is not JSON: ${res.status} ${res.statusText} - ${text}`
    );
  }

  if (!res.ok) {
    const errMsg =
      json?.error?.message ||
      json?.error?.class ||
      `${res.status} ${res.statusText}`;
    const err = new Error(`Salt Edge error: ${errMsg}`);
    err.status = res.status;
    err.payload = json;
    throw err;
  }

  return json;
}

/**
 * Načítanie providerov (banky) – čisto na test integrácie.
 */
export async function seGetProviders(params = {}) {
  const query = new URLSearchParams(params).toString();
  const path = `/providers${query ? `?${query}` : ""}`;
  const json = await saltedgeRequest(path, { method: "GET" });

  return json?.data ?? [];
}

/**
 * Vytvorenie customer-a na Salt Edge (pre konkrétneho tenanta).
 */
export async function seCreateCustomer({ identifier }) {
  const body = {
    data: {
      identifier, // napr. "tenant_<tenantId>"
    },
  };

  const json = await saltedgeRequest("/customers", {
    method: "POST",
    body,
  });

  return json?.data;
}

/**
 * Vytvorenie connection (napojenie banky) – vráti link na redirect.
 * Toto budeš neskôr volať z FE flowu ("Pripojiť bankový účet").
 */
export async function seCreateConnection({
  customerId,
  providerCode,
  redirectUrl,
  consent,
}) {
  const body = {
    data: {
      customer_id: customerId,
      provider_code: providerCode,
      // URL, kam sa má user vrátiť po authorizácii
      redirect_url: redirectUrl,
      consent: consent || {
        scopes: ["account_details", "transactions_details"],
      },
    },
  };

  const json = await saltedgeRequest("/connections", {
    method: "POST",
    body,
  });

  return json?.data;
}
