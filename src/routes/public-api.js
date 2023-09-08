import express from "express";
import userController from "../controller/user-controller.js";

const publicRoutes = new express.Router();
publicRoutes.post("/api/users", userController.register);

export { publicRoutes };
