import Controller from "../controllers/order.controller";
import express from "express";

export const router = express.Router();

router.post("/", Controller.create);
router.put("/:id", Controller.updateOne);
router.patch("/:id", Controller.updateStatus);
