import * as Interfaces from ".././interfaces";
import * as Utils from ".././utils";

// Function to validate email format
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const check: Interfaces.Middlewares.Async = async (req, _res, next) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return next(Utils.Response.error("Invalid name", 400));
    }

    // Check if username is invalid
    if (!username || typeof username !== "string" || username.trim() === "") {
      return next(Utils.Response.error("Invalid username", 400));
    }

    // Check if email is invalid
    if (!email || typeof email !== "string" || !validateEmail(email)) {
      return next(Utils.Response.error("Invalid email", 400));
    }

    // Check if password is invalid
    if (!password || typeof password !== "string" || password.trim() === "") {
      return next(Utils.Response.error("Invalid password", 400));
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.log(error);
    return next(Utils.Response.error("Error in Middleware", 500));
  }
};
