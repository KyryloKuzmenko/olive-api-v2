
import express from "express";
import Olive from "../models/olive.model.js";

const router = express.Router();
router.get("/test/olives", async (req, res) => {
  try {
    const olives = await Olive.find({});
    res.status(200).json({ olives });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
