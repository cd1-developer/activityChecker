// import express from "express";
// import type { Request, Response } from "express";
// import avGrowthModel from "../model/entrustV4Model";

// const router = express.Router();

// router.get("/", async (req: Request, res: Response) => {
//   try {
//     const { startDate, endDate, specialStartDate, specialEndDate } = req.query;

//     let dateFilter: Record<string, any> = {};

//     if (specialStartDate && specialEndDate) {
//       // Special condition: only grab data of exactly these two dates
//       const start = new Date(specialStartDate as string);
//       const startEnd = new Date(specialStartDate as string);
//       startEnd.setUTCHours(23, 59, 59, 999);

//       const end = new Date(specialEndDate as string);
//       const endEnd = new Date(specialEndDate as string);
//       endEnd.setUTCHours(23, 59, 59, 999);

//       dateFilter = {
//         $or: [
//           {
//             "avGrowthInfo.createdAt": {
//               $gte: start,
//               $lte: startEnd,
//             },
//           },
//           {
//             "avGrowthInfo.createdAt": {
//               $gte: end,
//               $lte: endEnd,
//             },
//           },
//         ],
//       };
//     } else if (startDate && endDate) {
//       dateFilter = {
//         "avGrowthInfo.createdAt": {
//           $gte: new Date(startDate as string),
//           $lte: new Date(endDate as string),
//         },
//       };
//     } else if (startDate) {
//       dateFilter = {
//         "avGrowthInfo.createdAt": {
//           $gte: new Date(startDate as string),
//         },
//       };
//     } else if (endDate) {
//       dateFilter = {
//         "avGrowthInfo.createdAt": {
//           $lte: new Date(endDate as string),
//         },
//       };
//     }
//     // No dates: fetch everything

//     const documents = await avGrowthModel
//       .find(dateFilter)
//       .populate("usernameId", "username");

//     const data = documents.map((doc: any) => {
//       const username = doc.usernameId?.username || "";

//       const filteredAvGrowthInfo = doc.avGrowthInfo
//         .filter((item: any) => {
//           const createdAt = item.createdAt ? new Date(item.createdAt) : null;
//           if (!createdAt) return true;

//           if (specialStartDate && specialEndDate) {
//             // Only return items that match exactly specialStartDate OR specialEndDate
//             const spStart = new Date(specialStartDate as string);
//             const spStartEnd = new Date(specialStartDate as string);
//             spStartEnd.setUTCHours(23, 59, 59, 999);

//             const spEnd = new Date(specialEndDate as string);
//             const spEndEnd = new Date(specialEndDate as string);
//             spEndEnd.setUTCHours(23, 59, 59, 999);

//             const matchesSpecialStart =
//               createdAt >= spStart && createdAt <= spStartEnd;
//             const matchesSpecialEnd =
//               createdAt >= spEnd && createdAt <= spEndEnd;

//             return matchesSpecialStart || matchesSpecialEnd;
//           } else if (startDate && endDate) {
//             return (
//               createdAt >= new Date(startDate as string) &&
//               createdAt <= new Date(endDate as string)
//             );
//           } else if (startDate) {
//             return createdAt >= new Date(startDate as string);
//           } else if (endDate) {
//             return createdAt <= new Date(endDate as string);
//           }

//           return true;
//         })
//         .map((item: any) => ({
//           ...item.toObject(),
//           username,
//         }));

//       return {
//         _id: doc._id,
//         avGrowthInfo: filteredAvGrowthInfo,
//       };
//     });

//     const filteredData = data.filter((doc) => doc.avGrowthInfo.length > 0);

//     return res.status(200).json({
//       success: true,
//       count: filteredData.length,
//       data: filteredData,
//     });
//   } catch (error) {
//     console.error("Error fetching AV Growth:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch AV Growth data",
//     });
//   }
// });

// export default router;

import express from "express";
import type { Request, Response } from "express";
import avGrowthModel from "../model/entrustV4Model";

const router = express.Router();

// Helper: get start and end of a day in UTC
function getDayRange(dateStr: string): { start: Date; end: Date } {
  const [day, month, year] = dateStr.split("-");
  const start = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  const end = new Date(`${year}-${month}-${day}T23:59:59.999Z`);
  return { start, end };
}

// Helper: build the date match expression once — no repeated recomputation
function buildDateMatchExpr(
  startDate?: string,
  endDate?: string,
  specialStartDate?: string,
  specialEndDate?: string,
): Record<string, any> | null {
  if (specialStartDate && specialEndDate) {
    const sp1 = getDayRange(specialStartDate);
    const sp2 = getDayRange(specialEndDate);
    return {
      $or: [
        {
          $and: [
            { $gte: ["$$item.createdAt", sp1.start] },
            { $lte: ["$$item.createdAt", sp1.end] },
          ],
        },
        {
          $and: [
            { $gte: ["$$item.createdAt", sp2.start] },
            { $lte: ["$$item.createdAt", sp2.end] },
          ],
        },
      ],
    };
  }

  if (specialStartDate) {
    const sp = getDayRange(specialStartDate);
    return {
      $and: [
        { $gte: ["$$item.createdAt", sp.start] },
        { $lte: ["$$item.createdAt", sp.end] },
      ],
    };
  }

  if (specialEndDate) {
    const sp = getDayRange(specialEndDate);
    return {
      $and: [
        { $gte: ["$$item.createdAt", sp.start] },
        { $lte: ["$$item.createdAt", sp.end] },
      ],
    };
  }

  if (startDate && endDate) {
    const start = getDayRange(startDate).start;
    const end = getDayRange(endDate).end;
    return {
      $and: [
        { $gte: ["$$item.createdAt", start] },
        { $lte: ["$$item.createdAt", end] },
      ],
    };
  }

  if (startDate) {
    const { start, end } = getDayRange(startDate);
    return {
      $and: [
        { $gte: ["$$item.createdAt", start] },
        { $lte: ["$$item.createdAt", end] },
      ],
    };
  }

  if (endDate) {
    const { start, end } = getDayRange(endDate);
    return {
      $and: [
        { $gte: ["$$item.createdAt", start] },
        { $lte: ["$$item.createdAt", end] },
      ],
    };
  }

  return null; // no date filter → fetch everything
}

// Helper: build the top-level $match stage for index usage
function buildTopLevelMatch(
  startDate?: string,
  endDate?: string,
  specialStartDate?: string,
  specialEndDate?: string,
): Record<string, any> {
  if (specialStartDate && specialEndDate) {
    const sp1 = getDayRange(specialStartDate);
    const sp2 = getDayRange(specialEndDate);
    return {
      $or: [
        { "avGrowthInfo.createdAt": { $gte: sp1.start, $lte: sp1.end } },
        { "avGrowthInfo.createdAt": { $gte: sp2.start, $lte: sp2.end } },
      ],
    };
  }

  if (specialStartDate) {
    const sp = getDayRange(specialStartDate);
    return { "avGrowthInfo.createdAt": { $gte: sp.start, $lte: sp.end } };
  }

  if (specialEndDate) {
    const sp = getDayRange(specialEndDate);
    return { "avGrowthInfo.createdAt": { $gte: sp.start, $lte: sp.end } };
  }

  if (startDate && endDate) {
    return {
      "avGrowthInfo.createdAt": {
        $gte: getDayRange(startDate).start,
        $lte: getDayRange(endDate).end,
      },
    };
  }

  if (startDate) {
    const { start, end } = getDayRange(startDate);
    return { "avGrowthInfo.createdAt": { $gte: start, $lte: end } };
  }

  if (endDate) {
    const { start, end } = getDayRange(endDate);
    return { "avGrowthInfo.createdAt": { $gte: start, $lte: end } };
  }

  return {}; // no filter
}

router.get("/", async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, specialStartDate, specialEndDate } =
      req.query as Record<string, string | undefined>;

    // ── 1. Compute date expressions ONCE (not inside per-item loops) ──────────
    const topLevelMatch = buildTopLevelMatch(
      startDate,
      endDate,
      specialStartDate,
      specialEndDate,
    );
    const filterExpr = buildDateMatchExpr(
      startDate,
      endDate,
      specialStartDate,
      specialEndDate,
    );

    // ── 2. Single aggregation pipeline replaces find + populate + JS filter ───
    const pipeline: any[] = [
      // Stage 1: index-based pre-filter — eliminates most documents early
      { $match: topLevelMatch },

      // Stage 2: filter avGrowthInfo array inside MongoDB (no JS re-filtering)
      {
        $addFields: {
          avGrowthInfo: filterExpr
            ? {
                $filter: {
                  input: "$avGrowthInfo",
                  as: "item",
                  cond: filterExpr,
                },
              }
            : "$avGrowthInfo",
        },
      },

      // Stage 3: drop documents where no array items survived the filter
      { $match: { "avGrowthInfo.0": { $exists: true } } },

      // Stage 4: $lookup replaces .populate() — single batched join, not N queries
      {
        $lookup: {
          from: "usernames", // ← your actual collection name
          localField: "usernameId",
          foreignField: "_id",
          as: "usernameData",
        },
      },

      // Stage 5: flatten the lookup array to a single field
      {
        $addFields: {
          username: { $arrayElemAt: ["$usernameData.username", 0] },
        },
      },

      // Stage 6: inject username into every avGrowthInfo item
      {
        $addFields: {
          avGrowthInfo: {
            $map: {
              input: "$avGrowthInfo",
              as: "item",
              in: { $mergeObjects: ["$$item", { username: "$username" }] },
            },
          },
        },
      },

      // Stage 7: clean up temporary fields from the response
      {
        $project: {
          usernameData: 0,
          username: 0,
        },
      },
    ];

    const data = await avGrowthModel.aggregate(pipeline);

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Error fetching AV Growth:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch AV Growth data",
    });
  }
});

export default router;
