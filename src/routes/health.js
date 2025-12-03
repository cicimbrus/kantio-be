import { Router } from "express";

export const router = Router();

router.get("/", (req, res) => {
  res.json({ status: "ok", service: "kantio-be" });
});
