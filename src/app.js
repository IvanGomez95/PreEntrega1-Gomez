import express from "express";
import cookieParser from "cookie-parser";
import router from "./routes/index.routes.js";
import { errorHandle } from "./errors/errHandle.js";
import { logger } from "./utils/logger.js";
import swaggerUiExpress from "swagger-ui-express";
import { specs } from "./config/swagger.config.js";
import { connectMongoDB } from "./config/mongoDB.config.js";
import envs from "./config/envs.config.js"


const app = express();
connectMongoDB();


app.use(express.json());
app.use(cookieParser());
app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.use("/api", router);


app.use(errorHandle);

app.listen(envs.PORT, () => logger.info(`Listening on ${envs.PORT}`));