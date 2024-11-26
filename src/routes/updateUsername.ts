import { Router, Request, Response } from "express";
import AccountModel from "../model/accountModel";

const router = Router();

router.patch("/", async (req: Request, res: Response) => {
  try {
    const { username, updatedUsername } = req.body;
    const filter = { username: username };

    // Find the document based on the username
    const data = await AccountModel.findOne(filter);

    if (!data) {
      // If no document is found, return a message with 404 status
      return res
        .status(404)
        .json({ message: "No document found matching the filter." });
    }

    // // Update the document's username
    const result = await AccountModel.findByIdAndUpdate(
      data._id,
      {
        $set: { username: updatedUsername },
      },
      { new: true }
    ); // `new: true` returns the updated document

    // If the update was successful, return the updated document
    if (result) {
      return res.json({ message: "Username updated successfully", result });
    } else {
      return res.status(400).json({ message: "Failed to update username" });
    }
  } catch (error: any) {
    console.error("Error updating usernames:", error);
    // Send error response with 500 status code
    return res
      .status(500)
      .json({ error: "An error occurred while updating usernames." });
  }
});

export default router;
