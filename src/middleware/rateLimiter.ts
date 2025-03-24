import { createClient } from "redis";
import { Request, Response, NextFunction } from "express";

const redisClient = createClient();

redisClient.on("error", (e) => console.error(`Redis Error: ${e}`));

redisClient.connect();

async function rateLimiter(req: Request, res: Response, next: NextFunction) {
  try {
    const ip = (req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress) as string;

    if (!ip) {
      return res
        .status(400)
        .json({ success: false, message: "IP address not found" });
    }

    // Get the current request count for this IP
    const requests = await redisClient.incr(ip);
    let ttl: number;

    if (requests === 1) {
      await redisClient.expire(ip, 60);
      ttl = 60;
    } else {
      ttl = await redisClient.ttl(ip); // Fetch remaining time-to-live for the key
    }

    if (requests > 100) {
      return res.status(429).json({
        success: false,
        message: `Rate limit exceeded. Try again in ${ttl} seconds.`,
      });
    }

    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export default rateLimiter;
