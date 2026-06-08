import express from "express";
import type { Request, Response } from "express";
import avGrowthModel from "../model/entrustV4Model";
import usernameModel from "../model/UsernameModel";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const rows = req.body;

    if (!Array.isArray(rows)) {
      return res.status(400).json({
        success: false,
        message: "Expected an array of rows",
      });
    }

    const usernames = Array.from(new Set(rows.map((row) => row.username)));

    const usernameDocs = await usernameModel.find({
      username: { $in: usernames },
    });

    const usernameMap = new Map();
    usernameDocs.forEach((doc) => {
      usernameMap.set(doc.username, doc._id);
    });

    // Get today's date range
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setUTCHours(23, 59, 59, 999);

    const grouped: Record<string, any> = {};

    for (const row of rows) {
      const usernameId = usernameMap.get(row.username);

      if (!usernameId) {
        console.warn(`Username not found: ${row.username}`);
        continue;
      }

      const key = usernameId.toString();

      if (!grouped[key]) {
        grouped[key] = {
          usernameId,
          avGrowthInfo: [],
        };
      }

      grouped[key].avGrowthInfo.push({
        subId: row.subId,
        placement: row.placement,
        status: row.status,
        avUsername: row.avUsername,
        access: row.access,
        rebill: row.rebill,
        startDate: row.startDate ? new Date(row.startDate) : undefined,
        expiryDate: row.expiryDate ? new Date(row.expiryDate) : undefined,
        executive: row.executive,
        teamId: row.teamId,
      });
    }

    let skippedUsers = 0;
    let syncedUsers = 0;

    for (const doc of Object.values(grouped) as any[]) {
      // Check if this user already has data saved today
      const existingDoc = await avGrowthModel.findOne({
        usernameId: doc.usernameId,
        "avGrowthInfo.createdAt": {
          $gte: todayStart,
          $lte: todayEnd,
        },
      });

      if (existingDoc) {
        // Already has today's data — skip to avoid duplicates
        console.warn(`Skipping duplicate for usernameId: ${doc.usernameId}`);
        skippedUsers++;
        continue;
      }

      // No data for today — safe to push
      await avGrowthModel.updateOne(
        { usernameId: doc.usernameId },
        {
          $push: {
            avGrowthInfo: {
              $each: doc.avGrowthInfo,
            },
          },
        },
        { upsert: true },
      );

      syncedUsers++;
    }

    return res.status(200).json({
      success: true,
      message: "Av Growth synced successfully",
      syncedUsers,
      skippedUsers, // tells you how many were skipped due to duplicate
    });
  } catch (error) {
    console.error("Error syncing Av Growth:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to sync AV Growth",
    });
  }
});

export default router;
