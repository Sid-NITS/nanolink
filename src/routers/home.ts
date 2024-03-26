import express from "express";
import * as Controllers from "../controllers";

const router = express.Router();

router.get("/", Controllers.Home.home);

export default router;
