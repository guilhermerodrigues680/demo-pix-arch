import { Router } from "express";
import * as backendApi from "./client/backend-api.js";

const api = Router();

api.get("/", (req, res) => {
  res.json({ message: "BANK-API - hello world" });
});

api.post("/pix", async (req, res) => {
  res.json({ message: "OK cobrança pix criada", qrCode: "asascsasdasdasvasv" });

  // Rotina assincrona, executa depois de um tempo
  setTimeout(async () => {
    try {
      await backendApi.sendWebhookPixUpdate("PAID");
      console.debug("sendWebhookPixUpdate success");
    } catch (error) {
      console.error("sendWebhookPixUpdate error:", error.name, error.message);
    }
  }, 6000);
});

export default api;
