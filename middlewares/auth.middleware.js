import Session from "../models/session.model.js";
import User from "../models/user.model.js";

const authorize = async (req, res, next) => {
  try {
    let token = req.cookies.accessToken;

    if (!token) return res.status(401).json({ message: "Unathorized" });

    const session = await Session.findOne({ accessToken: token });

    if (!session || session.accessTokenValidUntil < Date.now()) {
      return res
        .status(401)
        .json({ message: "Unauthorized: session expired or not found" });
    }

    const user = await User.findById(session.userId);

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user;
    req.session = session;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

export default authorize;
