import { RequestHandler } from "express";
import appAssert from "@/common/utils/appAssert";
import { UNAUTHORIZED, AppErrorCode } from  "@/common/const/constants";
import { verifyAccessToken } from "@/common/utils/jwt";
export interface AccessTokenPayload {
  userId: number;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: number;
  iat?: number;
  exp?: number;
}
const authenticate: RequestHandler = (req, res, next) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  appAssert(
    accessToken,
    UNAUTHORIZED,
    "Not authorized",
    AppErrorCode.InvalidAccessToken
  );

  const { error, payload } = verifyAccessToken(accessToken);
  appAssert(
    payload,
    UNAUTHORIZED,
    error === "jwt expired" ? "Token expired" : "Invalid token",
    AppErrorCode.InvalidAccessToken
  );

  const jwtPayload = payload as AccessTokenPayload;
  req.userId = jwtPayload.userId;
  next();
};
export default authenticate;