// auth.route.ts
import { Router } from "express";
import authController from "./auth.controller";
import { OpenAPIRegistry, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "../../swagger/openAPIResponseBuilders";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import {
  registerSchema,
  loginSchema,
} from "./auth.schema";

extendZodWithOpenApi(z);

export const authRegistry = new OpenAPIRegistry();

// Đăng ký schema
authRegistry.register("RegisterRequest", registerSchema);
authRegistry.register("RegisterResponse", registerSchema.omit({ password: true, confirmPassword: true }));
authRegistry.register("LoginRequest", loginSchema);
authRegistry.register("LoginResponse", loginSchema.omit({ password: true }));

// Swagger cho /auth/register
authRegistry.registerPath({
  method: "post",
  path: "/auth/register",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": { schema: registerSchema },
      },
    },
  },
  responses: {
    ...createApiResponse(registerSchema, "Đăng ký thành công", StatusCodes.CREATED),
    ...createApiResponse(z.null(), "Email đã tồn tại", StatusCodes.CONFLICT),
  },
});

// Swagger cho /auth/login
authRegistry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": { schema: loginSchema },
      },
    },
  },
  responses: {
    ...createApiResponse(loginSchema, "Đăng nhập thành công", StatusCodes.OK),
    ...createApiResponse(z.null(), "Sai email hoặc mật khẩu", StatusCodes.UNAUTHORIZED),
  },
});

// 🚀 Route thực tế dùng controller
const authRoutes = Router();
authRoutes.post("/register", authController.registerHandler);
authRoutes.post("/login", authController.loginHandler);
authRoutes.get("/refresh", authController.refreshHandler);
authRoutes.get("/logout", authController.logoutHandler);
authRoutes.get("/email/verify/:code", authController.verifyEmailHandler);
authRoutes.post("/password/forgot", authController.sendPasswordResetHandler);
authRoutes.post("/password/reset", authController.resetPasswordHandler);

export default authRoutes;
