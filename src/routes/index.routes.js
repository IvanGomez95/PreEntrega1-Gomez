import { Router } from "express";
import usersRouter from "./users.routes.js";
import petsRouter from "./pets.routes.js";
import adoptionsRouter from "./adoption.routes.js";
import sessionsRouter from "./sessions.routes.js";
import mocksRouter from "./mock.routes.js";

const router = Router();
router.use("/users", usersRouter);
router.use("/pets", petsRouter);
router.use("/adoptions", adoptionsRouter);
router.use("/sessions", sessionsRouter);
router.use("/mocks", mocksRouter);
export default router;