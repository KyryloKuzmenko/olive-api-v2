import mongoose from "mongoose";

import { createUser, loginUser } from "../services/auth.services.js";

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await createUser(req.body, session);

    const userData = user.toObject();
    delete userData.password;

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user: userData,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { user, session } = await loginUser(req.body);

    const userData = user.toObject();
    delete userData.password;

    const {
      accessToken,
      refreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
      _id,
    } = session;

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: accessTokenValidUntil,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: refreshTokenValidUntil,
    });

    res.cookie("sessionId", _id, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: refreshTokenValidUntil,
    });

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        user: userData,
        session: {
          accessToken,
          refreshToken,
          accessTokenValidUntil,
          refreshTokenValidUntil,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {};
