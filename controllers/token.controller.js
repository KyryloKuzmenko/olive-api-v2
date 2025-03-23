import { handleRefreshToken } from "../services/token.services.js";

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    const { user, session } = await handleRefreshToken(refreshToken);

    res.cookie("accessToken", session.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: session.accessTokenValidUntil,
    });

    res.cookie("refreshToken", session.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: session.refreshTokenValidUntil,
    });

    res.cookie("sessionId", session._id, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: session.refreshTokenValidUntil,
    });

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        accessTokenValidUntil: session.accessTokenValidUntil,
        refreshTokenValidUntil: session.refreshTokenValidUntil,
      },
    });
  } catch (error) {
    next(error);
  }
};
