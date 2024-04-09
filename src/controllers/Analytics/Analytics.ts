import * as Interfaces from "../../interfaces";
import * as Utils from "../../utils";
import prisma from "../../../prisma/prismaClient";

// Define the getAnalytics middleware function
const getAnalytics: Interfaces.Middlewares.Auth = async (req, res, next) => {
  try {
    // Extract user ID from the request object (assuming it's set by authentication middleware)
    const userId = req.user?.id;

    // Check if user ID is available
    if (!userId) {
      return next(Utils.Response.error("User ID not provided")); // Return an error if user ID is not available
    }

    // Fetch analytics data for the currently logged-in user
    const analyticsData = await prisma.url.findMany({
      where: {
        // Filter analytics data based on user ID
        user: {
          id: userId,
        },
      },
      select: {
        id: true,
        originalUrl: true,
        shortUrl: true,
        clickedCount: true,
        lastClicked: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Return analytics data as response
    return res.json(analyticsData);
  } catch (error) {
    console.log(error);
    return next(Utils.Response.error("Error fetching analytics data"));
  }
};

// Export the getAnalytics middleware function
export { getAnalytics };
