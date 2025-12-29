import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";

export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Try to get token from Authorization header first (standard Bearer format)
      let access_token = req.headers["authorization"] as string;
      
      console.log("🔐 Auth Check - Authorization header:", access_token ? "✅ Present" : "❌ Missing");
      
      // Extract token from "Bearer <token>" format
      if (access_token && access_token.startsWith("Bearer ")) {
        access_token = access_token.slice(7);
        console.log("✅ Extracted token from Bearer format");
      }
      
      // Fallback to access-token header if Authorization header not found
      if (!access_token) {
        access_token = req.headers["access-token"] as string;
        console.log("🔄 Using access-token header fallback:", access_token ? "✅ Found" : "❌ Not found");
      }

      if (!access_token) {
        console.log("❌ No token found - returning 401");
        return next(
          new ErrorHandler("Please login to access this resource", 401)
        );
      }

      const decoded = jwt.verify(
        access_token,
        process.env.ACCESS_TOKEN as string
      ) as JwtPayload;

      if (!decoded?.id) {
        return next(new ErrorHandler("Access token is not valid", 401));
      }

      const user = await redis.get(decoded.id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      req.user = JSON.parse(user);
      next();
    } catch (error) {
      return next(new ErrorHandler("Authentication failed", 401));
    }
  }
);

// Validate user roles
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if req.user exists and has a role
    const userRole = req.user?.role;

    if (!userRole || !roles.includes(userRole)) {
      return next(
        new ErrorHandler(`Role: ${userRole || "undefined"} is not allowed to access this resource`, 403)
      );
    }

    // If role is allowed, proceed
    next();
  };
};