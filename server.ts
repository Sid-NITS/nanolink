import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import * as Middlewares from "./src/middlewares";
import * as Routers from "./src/routers";
import * as Constants from "./src/globals/constants";
import cookieParser from "cookie-parser";
import * as Controllers from "./src/controllers";
import AnalyticsRouter from "./src/routers/analytics";

const app = express();

// Middlewares
app
  .use(cors())
  .use(helmet())
  .use(morgan("dev"))
  .use(express.json())
  .use(express.urlencoded({ extended: true }));

app.use(cookieParser());

dotenv.config();

// Routers
app.use(`${Constants.System.ROOT}/`, Routers.Home);
app.use(`${Constants.System.ROOT}/shorten`, Routers.Shorten);
app.use(`${Constants.System.ROOT}/signup`, Routers.signup);
app.use(`${Constants.System.ROOT}/login`, Routers.login);
app.use(`${Constants.System.ROOT}/logout`, Routers.logout);
app.use(`${Constants.System.ROOT}/url/delete`, Routers.deleteUrl);
app.use(`${Constants.System.ROOT}/url/manage`, Routers.manageUrl);
app.use(`${Constants.System.ROOT}/url/fetchAll`, Routers.fetchAllUrl);
app.use(`${Constants.System.ROOT}/analytics`, AnalyticsRouter);

app.get("/:shortId", Controllers.Redirect.redirect);

// Error Handlers
app.use(Middlewares.Error.errorHandler);

app.listen(Constants.System.PORT, () => {
  console.log(`Server started on port ${Constants.System.PORT}`);
});
