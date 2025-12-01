import mongoose from "mongoose";
import { connection } from "../config/redis.js";
export const health = async (req, res) => {
  return res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
};

export const healthExtended = async (req, res) => {
  const start = Date.now();

  // Default responses
  let mongoStatus = "unknown";
  let redisStatus = "unknown";

  // Check MongoDB
  try {
    await mongoose.connection.db.admin().ping();
    mongoStatus = "ok";
  } catch (err) {
    mongoStatus = "down";
  }

  // Check Redis (solo si lo tienes en tu proyecto)
  try {
    if (connection) {
      await connection.ping();
      redisStatus = "ok";
    }
  } catch (err) {
    redisStatus = "down";
  }

  const latency = Date.now() - start;

  const allOk = mongoStatus === "ok" && (connection ? redisStatus === "ok" : true);

  return res.status(allOk ? 200 : 503).json({
    status: allOk ? "ok" : "degraded",
    services: {
      api: "ok",
      mongo: mongoStatus,
      redis: connection ? redisStatus : "not-configured",
    },
    latency_ms: latency,
    timestamp: new Date().toISOString(),
  });
};
