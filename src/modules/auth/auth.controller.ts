import { Request, Response } from "express";
import { CREATED, OK, UNAUTHORIZED } from "@/common/const/constants";
import authService from "@/modules/auth/auth.service"
import appAssert from "@/common/utils/appAssert";
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from "@/common/utils/cookies";
import { verifyAccessToken } from "@/common/utils/jwt";
import catchErrors from "@/common/utils/catchErrors";
import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verificationCodeSchema,
} from "./auth.schema";

class authController {
  
  registerHandler = catchErrors(async (req: Request, res: Response) => {
    const request = registerSchema.parse({
      ...req.body,
      userAgent: req.headers["user-agent"],
    });
    const { user, accessToken, refreshToken } = await authService.createAccount({
      email: request.email,
      password: request.password,
      fullname: request.fullName,
      userAgent: request.userAgent,
      avatarUrl: request.avatar,
    });
    return setAuthCookies({ res, accessToken, refreshToken })
      .status(CREATED)
      .json(user);
  });

  loginHandler = catchErrors(async (req: Request, res: Response) => {
    const request = loginSchema.parse({
      ...req.body,
      userAgent: req.headers["user-agent"],
    });
    const { user, accessToken, refreshToken } = await authService.loginUser(request);

    // Set cookies
    return setAuthCookies({ res, accessToken, refreshToken })
      .status(OK)
      .json({ 
        message: "Login successful",
        user: user
      });
  });

  logoutHandler = catchErrors(async (req: Request, res: Response) => {
    // Simply clear cookies - no session to remove from DB
    return clearAuthCookies(res)
      .status(OK)
      .json({ message: "Logout successful" });
  });

  refreshHandler = catchErrors(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken as string | undefined;
    appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token");

    const { accessToken, newRefreshToken } = await authService.refreshUserAccessToken(refreshToken);
    
    if (newRefreshToken) {
      res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
    }
    
    return res
      .status(OK)
      .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
      .json({ message: "Access token refreshed" });
  });

  verifyEmailHandler = catchErrors(async (req: Request, res: Response) => {
    const verificationCode = verificationCodeSchema.parse(req.params.code);

    await authService.verifyEmail(verificationCode);

    return res.status(OK).json({ message: "Email was successfully verified" });
  });

  sendPasswordResetHandler = catchErrors(async (req: Request, res: Response) => {
    const email = emailSchema.parse(req.body.email);

    await authService.sendPasswordResetEmail(email);

    return res.status(OK).json({ message: "Password reset email sent" });
  });

  resetPasswordHandler = catchErrors(async (req: Request, res: Response) => {
    const request = resetPasswordSchema.parse(req.body);

    await authService.resetPassword(request);

    return clearAuthCookies(res)
      .status(OK)
      .json({ message: "Password was reset successfully" });
  });
}

export default new authController();