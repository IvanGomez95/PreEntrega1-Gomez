import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import router from "./routes/index.routes.js";

import { errorHandle } from "./errors/errHandle.js";
import { logger } from "./utils/logger.js";

const app = express();
const PORT = process.env.PORT || 8080;
const connection = mongoose.connect("mongodb://localhost:27017/Adoptions");

app.use(express.json());
app.use(cookieParser());

app.use("/api", router);


app.use(errorHandle);

app.listen(PORT, () => logger.info(`Listening on ${PORT}`));