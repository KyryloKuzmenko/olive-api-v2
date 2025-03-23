import { randomBytes } from "crypto";

import Session from "../models/session.model.js";
import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from "../constants/users.js";

export const createSession = async (userId) => {
  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");

  const session = await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + accessTokenLifetime,
    refreshTokenValidUntil: Date.now() + refreshTokenLifetime,
  });

  return session;
};
