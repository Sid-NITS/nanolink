import { isAuth } from "src/middlewares";
import * as controllers from "../controllers";
import { Router } from "express";

const router = Router();

router.post("/:id", isAuth, controllers.ManageUrl.manage);

export default router;
