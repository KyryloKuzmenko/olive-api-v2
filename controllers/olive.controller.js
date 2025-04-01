import Olive from "../models/olive.model.js";

import * as turf from "@turf/turf";
import regionPolygon from "../data/cherkasyRegion.js";
import { oneHourAgo } from "../constants/users.js";

export const createOlive = async (req, res, next) => {
  try {
    // 1️⃣ Ограничение по частоте — 1 маркер раз в 10 секунд
    const recent = await Olive.findOne({
      user: req.user._id,
      createdAt: { $gt: new Date(Date.now() - 10000) },
    });

    if (recent) {
      return res
        .status(429)
        .json({
          message: "Please wait before adding another marker",
          code: "TOO_SOON",
        });
    }

    // 2️⃣ Проверка, находится ли точка внутри допустимой области
    const { coordinates } = req.body.location || {};
    if (!coordinates || coordinates.length !== 2) {
      return res.status(400).json({ message: "Invalid location coordinates" });
    }

    const point = turf.point(coordinates);
    const isInside = turf.booleanPointInPolygon(point, regionPolygon);

    if (!isInside) {
      return res.status(403).json({
        message: "You can only place markers inside the allowed area",
      });
    }

    // 4️⃣ Проверка на наличие других маркеров в радиусе 200м
    const nearby = await Olive.findOne({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates,
          },
          $maxDistance: 200,
        },
      },
    });

    if (nearby) {
      return res.status(403).json({
        message: "Another marker already exists within 200 meters",
      });
    }

    // 4️⃣ Проверка на лимит: не более 3 маркеров за последний час
    const recentMarkers = await Olive.countDocuments({
      user: req.user._id,
      createdAt: { $gt: oneHourAgo },
    });

    if (recentMarkers >= 3) {
      return res.status(429).json({
        message: "You can only place 3 markers per hour",
        code: "MARKER_LIMIT_REACHED",
      });
    }

    const olive = await Olive.create({ ...req.body, user: req.user._id });

    setTimeout(async () => {
      await Olive.deleteOne({ _id: olive._id });
    }, 60000);

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
