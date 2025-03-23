import bcrypt from "bcryptjs";

import Session from "../models/session.model.js";
import User from "../models/user.model.js";
import { createSession } from "../utils/session.js";

export const createUser = async ({ name, email, password }, session) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 409;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

  const newUsers = await User.create(
    [{ name, email, password: hashedpassword }],
    { session }
  );

  return newUsers[0];
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("Email or password invalid");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Email or password invalid");
    error.statusCode = 401;
    throw error;
  }

  await Session.deleteMany({ userId: user._id });

  const session = await createSession(user._id);

  return { user, session };
};
