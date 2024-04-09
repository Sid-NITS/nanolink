import * as Interfaces from ".././interfaces";
import * as Utils from ".././utils";
import { verifyJWT } from "../utils/auth/security/verifyJWT";
import prisma from "../.././prisma/prismaClient";

// import * as Errors from ".././globals/errors";
import jwt from "jsonwebtoken";

export const isAuth: Interfaces.Middlewares.Auth = async (req, res, next) => {
  // Add the 'Request' type to the 'req' parameter
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded: any = verifyJWT(token);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
      if (!user) {
        return res.status(401).json({ message: "Unauthorized - Invalid user" });
      }
      req.user = user; // Add the 'user' property to the 'req' object
      next();
    } catch (error) {
      console.log(error);
      if (error instanceof jwt.JsonWebTokenError) {
        return next(Utils.Response.error("Error in Middleware", 500));
      }
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};
