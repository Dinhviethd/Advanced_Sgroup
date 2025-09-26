import { Router } from "express";
import authController from "./auth.controller";
const authRoutes = Router();

authRoutes.post("/register", authController.registerHandler);
authRoutes.post("/login", authController.loginHandler);
authRoutes.get("/refresh", authController.refreshHandler);
authRoutes.get("/logout", authController.logoutHandler);
authRoutes.get("/email/verify/:code", authController.verifyEmailHandler);
authRoutes.post("/password/forgot", authController.sendPasswordResetHandler);
authRoutes.post("/password/reset", authController.resetPasswordHandler);

export default authRoutes;