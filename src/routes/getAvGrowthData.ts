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

router.get("/", async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, specialStartDate, specialEndDate } = req.query;

    let dateFilter: Record<string, any> = {};
    let filterType = "";

    if (specialStartDate && specialEndDate) {
      // Grab data of ONLY these two exact dates (not between)
      const sp1 = getDayRange(specialStartDate as string);
      const sp2 = getDayRange(specialEndDate as string);

      dateFilter = {
        $or: [
          { "avGrowthInfo.createdAt": { $gte: sp1.start, $lte: sp1.end } },
          { "avGrowthInfo.createdAt": { $gte: sp2.start, $lte: sp2.end } },
        ],
      };
      filterType = "specialBoth";
    } else if (specialStartDate) {
      // Grab data of only this exact date
      const sp = getDayRange(specialStartDate as string);
      dateFilter = {
        "avGrowthInfo.createdAt": { $gte: sp.start, $lte: sp.end },
      };
      filterType = "specialStart";
    } else if (specialEndDate) {
      // Grab data of only this exact date
      const sp = getDayRange(specialEndDate as string);
      dateFilter = {
        "avGrowthInfo.createdAt": { $gte: sp.start, $lte: sp.end },
      };
      filterType = "specialEnd";
    } else if (startDate && endDate) {
      // Grab all data between these two dates
      const start = getDayRange(startDate as string).start;
      const end = getDayRange(endDate as string).end;
      dateFilter = {
        "avGrowthInfo.createdAt": { $gte: start, $lte: end },
      };
      filterType = "range";
    } else if (startDate) {
      // Grab all data of only this exact date
      const { start, end } = getDayRange(startDate as string);
      dateFilter = {
        "avGrowthInfo.createdAt": { $gte: start, $lte: end },
      };
      filterType = "startOnly";
    } else if (endDate) {
      // Grab all data of only this exact date
      const { start, end } = getDayRange(endDate as string);
      dateFilter = {
        "avGrowthInfo.createdAt": { $gte: start, $lte: end },
      };
      filterType = "endOnly";
    }
    // No dates: fetch everything

    const documents = await avGrowthModel
      .find(dateFilter)
      .populate("usernameId", "username");

    const data = documents.map((doc: any) => {
      const username = doc.usernameId?.username || "";

      const filteredAvGrowthInfo = doc.avGrowthInfo
        .filter((item: any) => {
          const createdAt = item.createdAt ? new Date(item.createdAt) : null;
          if (!createdAt) return true;

          if (filterType === "specialBoth") {
            const sp1 = getDayRange(specialStartDate as string);
            const sp2 = getDayRange(specialEndDate as string);
            return (
              (createdAt >= sp1.start && createdAt <= sp1.end) ||
              (createdAt >= sp2.start && createdAt <= sp2.end)
            );
          } else if (filterType === "specialStart") {
            const sp = getDayRange(specialStartDate as string);
            return createdAt >= sp.start && createdAt <= sp.end;
          } else if (filterType === "specialEnd") {
            const sp = getDayRange(specialEndDate as string);
            return createdAt >= sp.start && createdAt <= sp.end;
          } else if (filterType === "range") {
            const start = getDayRange(startDate as string).start;
            const end = getDayRange(endDate as string).end;
            return createdAt >= start && createdAt <= end;
          } else if (filterType === "startOnly") {
            const { start, end } = getDayRange(startDate as string);
            return createdAt >= start && createdAt <= end;
          } else if (filterType === "endOnly") {
            const { start, end } = getDayRange(endDate as string);
            return createdAt >= start && createdAt <= end;
          }

          return true; // no filter → return everything
        })
        .map((item: any) => ({
          ...item.toObject(),
          username,
        }));

      return {
        _id: doc._id,
        avGrowthInfo: filteredAvGrowthInfo,
      };
    });

    const filteredData = data.filter((doc) => doc.avGrowthInfo.length > 0);

    return res.status(200).json({
      success: true,
      count: filteredData.length,
      data: filteredData,
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
