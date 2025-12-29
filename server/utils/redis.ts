import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.REDIS_URL) throw new Error("REDIS_URL not defined");

export const redis = new Redis(process.env.REDIS_URL, {
  tls: {}  // required for Upstash
});

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis connection error:", err));
redis.on("close", () => console.log("Redis connection closed"));
