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

    // ── 1. Resolve usernames → ObjectIds (single query) ──────────────────────
    const usernames = Array.from(new Set(rows.map((row) => row.username)));

    const usernameDocs = await usernameModel
      .find({ username: { $in: usernames } }, { _id: 1, username: 1 })
      .lean(); // lean() skips Mongoose hydration overhead

    const usernameMap = new Map<string, any>();
    usernameDocs.forEach((doc) => usernameMap.set(doc.username, doc._id));

    // ── 2. Group rows by usernameId (in-memory) ───────────────────────────────
    const grouped = new Map<string, { usernameId: any; avGrowthInfo: any[] }>();

    for (const row of rows) {
      const usernameId = usernameMap.get(row.username);
      if (!usernameId) {
        console.warn(`Username not found: ${row.username}`);
        continue;
      }

      const key = usernameId.toString();
      if (!grouped.has(key)) {
        grouped.set(key, { usernameId, avGrowthInfo: [] });
      }

      grouped.get(key)!.avGrowthInfo.push({
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

    if (grouped.size === 0) {
      return res.status(200).json({
        success: true,
        message: "No valid users to sync",
        syncedUsers: 0,
        skippedUsers: rows.length,
      });
    }

    // ── 3. Single query to find ALL users that already have today's data ──────
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setUTCHours(23, 59, 59, 999);

    const allUsernameIds = Array.from(grouped.values()).map(
      (g) => g.usernameId,
    );

    const alreadySyncedDocs = await avGrowthModel
      .find(
        {
          usernameId: { $in: allUsernameIds },
          "avGrowthInfo.createdAt": { $gte: todayStart, $lte: todayEnd },
        },
        { usernameId: 1 }, // project only what we need
      )
      .lean();

    const alreadySyncedSet = new Set(
      alreadySyncedDocs.map((doc) => doc.usernameId.toString()),
    );

    // ── 4. Build bulkWrite operations for all non-duplicate users ─────────────
    const bulkOps: any[] = [];
    let skippedUsers = 0;

    for (const [key, doc] of grouped) {
      if (alreadySyncedSet.has(key)) {
        console.warn(`Skipping duplicate for usernameId: ${doc.usernameId}`);
        skippedUsers++;
        continue;
      }

      bulkOps.push({
        updateOne: {
          filter: { usernameId: doc.usernameId },
          update: {
            $push: {
              avGrowthInfo: { $each: doc.avGrowthInfo },
            },
          },
          upsert: true,
        },
      });
    }

    // ── 5. Execute all writes in a single round-trip ──────────────────────────
    let syncedUsers = 0;

    if (bulkOps.length > 0) {
      const result = await avGrowthModel.bulkWrite(bulkOps, {
        ordered: false, // parallel execution; don't stop on first error
      });

      syncedUsers = result.upsertedCount + result.modifiedCount;
    }

    return res.status(200).json({
      success: true,
      message: "Av Growth synced successfully",
      syncedUsers,
      skippedUsers,
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
