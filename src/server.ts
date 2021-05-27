import express, { Response } from "express";

import { router as OrderRouter } from "./routes/order.routes";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

dotenv.config();
const PORT = process.env.PORT || 3333;

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/", (_, res: Response) => {
  res.send("ok");
});

app.use("/api/orders", OrderRouter);

app.listen(PORT, () => {
  console.log(`[SERVER] Listening on port ${PORT}`);
});
