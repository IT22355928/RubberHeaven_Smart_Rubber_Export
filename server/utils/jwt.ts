import { Response } from "express";
import { IUser } from "../model/user-model";
import { redis } from "./redis";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

// Parse environment variables (fallback values included)
  const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300", 10); // 5 min
  const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "1200", 10); // 20 min

  // Access Token Cookie Options
   export const accessTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
    maxAge: accessTokenExpire * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
  };

  // Refresh Token Cookie Options
   export const refreshTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
  };


export const sendToken = (user: IUser, statusCode: number, res: Response) => {

  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  // Upload session to Redis
  redis.set(user._id.toString(), JSON.stringify(user));

  // Set secure cookies only in production
  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
    refreshTokenOptions.secure = true;
  }

  // Send cookies
  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  // Send response
  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
    refreshToken,
  });
};
