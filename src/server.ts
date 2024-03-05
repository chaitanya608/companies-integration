import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import apiRouter from "./routes/apiRouter";
import healthRouter from "./routes/healthRouter";

require("dotenv").config();

const app = express();

mongoose.connect(process.env.DATABASE_URL || "");
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.use("/health", healthRouter);

app.listen(3000, () => console.log("App Started"));
