import express from "express";
import { isAuth } from "src/middlewares";
import * as Controllers from "../controllers";

const router = express.Router();

// Endpoint to get analytics data
router.get("/", isAuth, Controllers.Analytics.getAnalytics);

export default router;
