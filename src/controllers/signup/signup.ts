import * as Interfaces from "../../interfaces";
import * as Utils from "../../utils";

import prisma from "prisma/prismaClient";
import { generateToken } from "src/utils/auth/security/generateJWTtoken";
// import { verifyPassword } from "src/utils/auth/security/verifyPassword";
import { hashPassword } from "src/utils/auth/security/hashPassword";

import * as crypto from "crypto";

// Function to generate a random salt
function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

export const signup: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;
    // Check if the email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    });
    if (existingUser) {
      // Email already exists, redirect to the login page
      return res.json("Already signed up");
    }

    // Generate a random salt
    const salt = generateSalt();

    // Hash the password with the generated salt
    const hashedPassword = hashPassword(password, salt);

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        salt,
      },
    });

    // Generate JWT token
    const token = generateToken({ userId: newUser.id });

    // Set cookie with the token
    res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });

    const { msg, status } = Utils.Response.success(
      "User signed up successfully"
    );
    return res.json({ msg, status, user: newUser });
  } catch (error) {
    console.log(error);
    return next(Utils.Response.error("Error in signup"));
  }
};
