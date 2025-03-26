import { Router } from "express";

import authorize from '../middlewares/auth.middleware.js';
import { createOlive, getOlives } from "../controllers/olive.controller.js";
import arcjetMiddleware from "../middlewares/arcjet.middleware.js";

const oliveRouter = Router();

oliveRouter.get('/', authorize, getOlives);

oliveRouter.post('/', arcjetMiddleware, authorize, createOlive);

export default oliveRouter;
