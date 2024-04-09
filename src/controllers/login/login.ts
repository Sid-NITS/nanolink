import * as Interfaces from "../../interfaces";
import * as Utils from "../../utils";

import { generateToken } from "src/utils/auth/security/generateJWTtoken";

import { hashPassword } from "src/utils/auth/security/hashPassword";

export const login: Interfaces.Middlewares.Async = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await Utils.prisma.user.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    });

    if (!existingUser) {
      // User not found, display an error message
      return res
        .status(401)
        .json({ message: "Incorrect username or password" });
    }

    // Hash the provided password with the stored salt
    const hashedPassword = hashPassword(password, existingUser.salt);

    // Check if the password is correct
    if (hashedPassword !== existingUser.password) {
      // Incorrect password, display an error message
      return res
        .status(401)
        .json({ message: "Incorrect username or password" });
    }

    // Generate JWT token
    const token = generateToken({ userId: existingUser.id });

    // Set cookie with the token
    res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });

    return res.json(Utils.Response.success("Loggedin Successfully"));
  } catch (error) {
    console.log(error);
    return next(Utils.Response.error("Error in Login"));
  }
};
