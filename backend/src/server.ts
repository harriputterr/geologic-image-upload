import express from "express";

import { imageRouter } from "./container.ts";
import { connectDatabase } from "./lib/db.ts";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  next();
});

app.use("/api/image", imageRouter);

await connectDatabase();

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});
