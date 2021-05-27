import Controller from "../controllers/order.controller";
import express from "express";

export const router = express.Router();

router.post("/", Controller.create);
router.put("/:id", Controller.updateOne);
router.patch("/:id", Controller.updateStatus);
router.delete("/:id", Controller.deleteOne);
router.get("/metrics", Controller.metrics);
router.get("/:id", Controller.findOne);
router.get("/", Controller.count);
