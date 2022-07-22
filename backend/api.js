import { EventEmitter } from "events";
import { Router } from "express";
import * as bankApi from "./client/bank-api.js";
import * as sseUtils from "./sse-utils.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const api = Router();
const pixEvtEmitter = new EventEmitter();
let ssePixStatusClientId = -1;

api.get("/", (req, res) => {
  res.json({ message: "API - hello world" });
});

api.post("/purchase/pix", async (req, res) => {
  try {
    await bankApi.newPixCharge();
    res.json({ message: "Compra com pix realizada, aguardando pagamento." });
  } catch (error) {
    res.status(500).send({ message: error.name, detail: error.message });
  }
});

/**
 * https://developer.mozilla.org/pt-BR/docs/Web/API/Server-sent_events/Using_server-sent_events
 * https://stackoverflow.com/questions/34657222/how-to-use-server-sent-events-in-express-js
 * https://masteringjs.io/tutorials/express/server-sent-events
 * Teste com Curl: `curl -N http://localhost:12001/api/sse/pix-status`
 */
api.get("/sse/pix-status", async (req, res) => {
  const cliUA = req.headers["user-agent"];
  const cliId = ++ssePixStatusClientId;
  console.log(`New SSE Client, id: ${cliId}, ua: ${cliUA}`);

  res.set({
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
  });
  res.flushHeaders();

  let pixStatus = "AWAITING_PAYMENT";
  let isConnClosed = false;

  const onConnCloseAsync = new Promise((resolve) => {
    req.once("close", () => {
      isConnClosed = true;
      resolve();
    });
  });

  sseUtils.setClientRetryInterval(res);
  sseUtils.sendMessage(res, "hello world");
  sseUtils.sendTypedEvent(res, "pix:update", pixStatus);

  pixEvtEmitter.on("update", (newStatus) => {
    console.debug("update", newStatus);
    pixStatus = newStatus;
    sseUtils.sendTypedEvent(res, "pix:update", pixStatus);
    // TODO: Ao fazer isso o front fecha antes to tempo esperado
    // if (pixStatus === "PAID") res.end();
  });

  // loop para bloquear e manter a conexão
  while (!isConnClosed) {
    // comentário é útil para manter viva a conexão (keep-alive)
    sseUtils.sendComment(res);
    // Aguarda a conexão fechar ou 5 segundos
    await Promise.race([onConnCloseAsync, sleep(5000)]);
  }

  console.log(`Close SSE Client, id: ${cliId}`);
});

api.post("/webhooks/pix-update", (req, res) => {
  pixEvtEmitter.emit("update", "PAID");
  res.status(204).send();
});

export default api;
