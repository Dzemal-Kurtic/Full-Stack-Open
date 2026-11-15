import express from "express";
import { calculator } from "./calculator.ts";

const app = express();

app.post("/calculator", (req, res) => {
  const { value1, value2, op } = req.body;

  const result = calculator(value1, value2, op);
  return res.send({ result });
});

const x: any = 1;

app.get("/ping", (_req, res) => {
  res.send("pong");
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
