import * as Interfaces from "../../interfaces";
import * as Utils from "../../utils";
import prisma from "prisma/prismaClient";

const fetchAllUrl: Interfaces.Controllers.Auth = async (req, res, next) => {
  try {
    // const { msg, status } = Success.System.api;
    // const response = {
    //   msg,
    //   status,
    // };
    // console.log(req.user);
    const data = await prisma.url.findMany({
      where: {
        userId: req.user.id,
      },
    });
    return res.json(data);
  } catch (error) {
    console.log(error);
    return next(Utils.Response.error("Error in fetchAllUrl controller"));
  }
};

export { fetchAllUrl };
