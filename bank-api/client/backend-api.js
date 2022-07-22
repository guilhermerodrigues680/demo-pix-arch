import axios from "axios";

const apiInstance = axios.create({
  baseURL: "http://localhost:12001/api/",
  timeout: 30000,
});

async function sendWebhookPixUpdate(newStatus) {
  await apiInstance.post("webhooks/pix-update", { newStatus });
}

export { sendWebhookPixUpdate };
