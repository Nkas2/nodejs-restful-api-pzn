import express from "express";
import userController from "../controller/user-controller.js";
import contactController from "../controller/contact-controller.js";
import addressController from "../controller/address-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

// user api
userRouter.get("/api/users/current", userController.get);
userRouter.patch("/api/users/current", userController.update);
userRouter.delete("/api/users/logout", userController.logout);

// contact api
userRouter.post("/api/contacts", contactController.create);
userRouter.get("/api/contacts/:id", contactController.get);
userRouter.put("/api/contacts/:id", contactController.update);
userRouter.delete("/api/contacts/:id", contactController.remove);
userRouter.get("/api/contacts", contactController.search);

// address api
userRouter.post("/api/contacts/:contactId/addresses", addressController.create);
userController.get(
  "/api/contacts/:contactId/addresses/:addressId",
  addressController.get
);

export { userRouter };
