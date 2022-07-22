import express from "express";
import cors from "cors";
import morgan from "morgan";
import api from "./api.js";

const port = 12002;
const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use("/api/", api);

app.listen(port, () => {
  console.info(
    `back-api 'NODE_ENV=${process.env.NODE_ENV}' listening on port http://localhost:${port}`
  );
});
