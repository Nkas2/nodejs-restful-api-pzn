import express from "express";
import { publicRoutes } from "../routes/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { userRouter } from "../routes/api.js";

export const web = express();
web.use(express.json());

web.use(publicRoutes);
web.use(userRouter);

web.use(errorMiddleware);
