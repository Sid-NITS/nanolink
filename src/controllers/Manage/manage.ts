import * as Interfaces from "../../interfaces";
import * as Utils from "../../utils";
import prisma from "prisma/prismaClient";
import moment from "moment";

export const manage: Interfaces.Controllers.Auth = async (req, res, next) => {
  try {
    const { id } = req.params;
    // if(req.user){
    //   return next(Utils.Response.error("Unauthorized"));
    // }
    const { originalUrl, shortId } = req.body;
    const url = await prisma.url.findUnique({
      where: {
        id: id,
      },
    });
    if (!url) {
      const { status, msg } = Utils.Response.error("Url not found");
      return res.status(status).json({ msg });
    } else if (url.userId !== req.user.id) {
      const { status, msg } = Utils.Response.error("Unauthorized");
      return res.status(status).json({ msg });
    }
    const time = moment().format("MMMM Do YYYY, h:mm:ss a");
    let updatedUrl = {};
    if (originalUrl) {
      updatedUrl = await prisma.url.update({
        where: {
          id: id,
        },
        data: {
          originalUrl: originalUrl,
          updatedAt: time,
        },
      });
    }
    if (shortId) {
      if (url.shortUrl !== `${req.hostname}:${process.env.PORT}/${shortId}`) {
        return res.status(400).json({
          msg: "ShortId already exists in the database. Please try another one.",
        });
      }
      updatedUrl = await prisma.url.update({
        where: {
          id: id,
        },
        data: {
          shortUrl: `${req.hostname}:${process.env.PORT}/${shortId}`,
          updatedAt: time,
          clickedCount: 0,
          lastClicked: "Never",
        },
      });
    }
    if (!updatedUrl) {
      const { status, msg } = Utils.Response.error("Error in updating the url");
      return res.status(status).json({ msg });
    }
    const { status, msg } = Utils.Response.success("Url updated successfully");
    return res.json({ msg, status, updatedUrl });
  } catch (error) {
    console.log(error);
    return next(Utils.Response.error("Internal server error"));
  }
};
