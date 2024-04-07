import express from "express";
import * as Controllers from "../controllers";
import { isAuth } from "src/middlewares";
import { check } from "../middlewares/check";
import prisma from "../prisma/prismaClient";
const router = express.Router();

// Create a short URL and update analytics
router.post("/api/shorten", isAuth, check, async (req, res) => {
  const { originalUrl } = req.body;

  try {
    // Create the short URL
    const shortUrl = generateShortUrl(); // Implement your own logic to generate short URLs

    // Insert the short URL into the database
    const createdUrl = await prisma.url.create({
      data: {
        originalUrl,
        shortUrl,
        createdAt: new Date().toISOString(), // Set createdAt timestamp
        updatedAt: new Date().toISOString(), // Set updatedAt timestamp
        clickCount: 0, // Initialize click count to 0
        lastClicked: null, // Set lastClicked to null initially
        // You can also add other analytics data as needed
      },
    });

    // Return the created short URL
    res.status(201).json(createdUrl);
  } catch (error) {
    console.error("Error creating short URL:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Handle short URL redirection and update analytics
router.get("/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;

  try {
    // Find the short URL in the database
    const url = await prisma.url.findUnique({
      where: {
        shortUrl,
      },
    });

    if (!url) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    // Update analytics data
    await prisma.url.update({
      where: {
        shortUrl,
      },
      data: {
        clickCount: url.clickCount + 1, // Increment click count
        lastClicked: new Date().toISOString(), // Update lastClicked timestamp
      },
    });

    // Redirect to the original URL
    res.redirect(url.originalUrl);
  } catch (error) {
    console.error("Error redirecting short URL:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Function to generate a short URL
function generateShortUrl(): string {
  // Implement your logic to generate short URLs here
  return "shorturl"; // Replace with actual generated short URL
}

export default router;
