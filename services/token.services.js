// import jwt from "jsonwebtoken";

// import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

// export const generateToken = (userId) => {
//   return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
// };

import Session from "../models/session.model.js";
import User from "../models/user.model.js";
import { createSession } from "../utils/session.js";

export const handleRefreshToken = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error("Refresh token missing");
    error.statusCode = 401;
    throw error;
  }

  const session = await Session.findOne({ refreshToken });

  if (!session || session.refreshTokenValidUntil < Date.now()) {
    const error = new Error("Invalid or expired refresh token");
    error.statusCode = 401;
    throw error;
  }

  const user = await User.findById(session.userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 401;
    throw error;
  }

  await Session.deleteOne({ _id: session._id });

  const newSession = await createSession(user._id);

  return { user, session: newSession };
};
