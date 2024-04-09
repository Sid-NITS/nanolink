import * as Interfaces from "../../interfaces";
import * as Utils from "../../utils";
import * as Success from "../../globals/success";
// import prisma from "prisma/prismaClient";

const home: Interfaces.Controllers.Auth = async (req, res, next) => {
  try {
    const { msg, status } = Success.System.api;
    const response = {
      msg,
      status,
    };
    console.log(req.user);
    // const data = await prisma.url.findMany({
    //   where: {
    //     userId: req.user.id,
    //   },
    // });
    return res.json(response);
  } catch (error) {
    console.log(error);
    return next(Utils.Response.error("Error in home controller"));
  }
};

export { home };
