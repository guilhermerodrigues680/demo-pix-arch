/** @type {HTMLFormElement} */
const formEl = document.querySelector("#pix-form");
/** @type {HTMLDivElement} */
const containerStatusPixEl = document.querySelector("#container-status-pix");

const apiUrl = "http://localhost:12001/api/";

async function requestPurchaseWithPix() {
  const reqUrl = new URL("purchase/pix", apiUrl);
  let res;
  try {
    res = await fetch(reqUrl.href, { method: "POST" });
  } catch (error) {
    console.error("fetch error:", error);
    throw error;
  }

  if (!res.ok) {
    // make the promise be rejected if we didn't get a 2xx response
    const err = new Error("Not 2xx response");
    err.response = response;
    throw err;
  }

  return await res.json();
}

function startSSE() {
  const ssePixStatusUrl = new URL("sse/pix-status", apiUrl);
  const evtSourcePixStatus = new EventSource(ssePixStatusUrl);
  console.debug("evtSourcePixStatus", evtSourcePixStatus);

  evtSourcePixStatus.addEventListener("open", () => {
    console.info("evtSourcePixStatus CONECTADO!");
  });

  evtSourcePixStatus.addEventListener("error", () => {
    console.warn("evtSourcePixStatus DESCONECTADO");
    console.info("evtSourcePixStatus RECONECTADO...");
  });

  evtSourcePixStatus.addEventListener("message", (evt) => {
    const { lastEventId: msgId, data: msgData } = evt;
    console.log("evtSourcePixStatus message:", msgId, msgData);
  });

  evtSourcePixStatus.addEventListener("pix:update", (evt) => {
    const { type, lastEventId: msgId, data: msgData } = evt;
    console.debug("evtSourcePixStatus:", msgId, type, msgData);
    containerStatusPixEl.innerText = `${msgId} - ${type} - ${msgData}`;

    if (msgData === "PAID") {
      evtSourcePixStatus.close();
    }
  });
}

formEl.addEventListener("submit", async (evt) => {
  evt.preventDefault();

  /** @type {HTMLButtonElement} */
  const pixFormBtnSubmitEl = document.querySelector("#pix-form-btn-submit");

  try {
    pixFormBtnSubmitEl.disabled = true;
    const res = await requestPurchaseWithPix();
    console.debug("PurchaseWithPix res:", res);
  } catch (error) {
    console.debug("PurchaseWithPix error:", error);
    pixFormBtnSubmitEl.disabled = false;
    return;
  }

  startSSE();
});
