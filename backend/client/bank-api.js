import axios from "axios";

const apiInstance = axios.create({
  baseURL: "http://localhost:12002/api/",
  timeout: 30000,
});

async function newPixCharge(data) {
  await apiInstance.post("pix");
}

export { newPixCharge };
