import Olive from "../models/olive.model.js";

export const createOlive = async (req, res, next) => {
  try {
    const recent = await Olive.findOne({
      user: req.user._id,
      createdAt: { $gt: new Date(Date.now() - 10000) },
    });

    if (recent) {
      return res
        .status(429)
        .json({ message: "Please wait before adding another marker" });
    }

    const olive = await Olive.create({ ...req.body, user: req.user._id });

    setTimeout(async () => {
      await Olive.deleteOne({ _id: olive._id });
    }, 20000);

    res.status(201).json({
      success: true,
      data: olive,
    });
  } catch (error) {
    next(error);
  }
};

export const getOlives = async (req, res, next) => {
  try {
    const olives = await Olive.find();

    res.status(200).json({
      success: true,
      data: olives,
    });
  } catch (error) {
    next(error);
  }
};
