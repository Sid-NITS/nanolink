import express from "express";
import * as Controllers from "../controllers";
import { isAuth } from "src/middlewares";

const router = express.Router();

router.get("/", isAuth, Controllers.FetchUrl.fetchAllUrl);

export default router;
