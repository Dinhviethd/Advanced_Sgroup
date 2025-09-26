import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const signAccessToken = (payload: object) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export const signRefreshToken = (payload: object) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
};

export const verifyAccessToken = (token: string) => {
  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    return { payload, error: null };
  } catch (error: any) {
    return { payload: null, error: error.message };
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    const payload = jwt.verify(token, REFRESH_TOKEN_SECRET);
    return { payload, error: null };
  } catch (error: any) {
    return { payload: null, error: error.message };
  }
};