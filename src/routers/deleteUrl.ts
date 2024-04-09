import express from "express";
import * as Controllers from "../controllers";

const router = express.Router();

router.delete("/:id", Controllers.DeleteUrl.DeleteUrl);

export default router;
