import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

// ⚡ Mở rộng Zod để có .openapi()
extendZodWithOpenApi(z);

export const emailSchema = z.string().email().min(1).max(255).openapi({
  example: "user@example.com",
  description: "Địa chỉ email hợp lệ",
});

const passwordSchema = z.string().min(6).max(255).openapi({
  example: "secret123",
  description: "Mật khẩu có ít nhất 6 ký tự",
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional().openapi({
    example: "Mozilla/5.0",
    description: "Thông tin thiết bị (tùy chọn)",
  }),
}).openapi("LoginRequest");

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema.openapi({
    example: "secret123",
    description: "Xác nhận mật khẩu (phải khớp password)",
  }),
  fullName: z.string().min(1).max(100).openapi({
    example: "Nguyen Van A",
    description: "Họ và tên đầy đủ",
  }),
  avatar: z.string().url().optional().openapi({
    example: "https://example.com/avatar.png",
    description: "Link ảnh đại diện (tùy chọn)",
  }),
  userAgent: z.string().optional().openapi({
    example: "Mozilla/5.0",
    description: "Thông tin thiết bị (tùy chọn)",
  }),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .openapi("RegisterRequest");

export const verificationCodeSchema = z.string().min(1).max(24).openapi({
  example: "ABC123",
  description: "Mã xác thực",
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  verificationCode: verificationCodeSchema,
}).openapi("ResetPasswordRequest");
