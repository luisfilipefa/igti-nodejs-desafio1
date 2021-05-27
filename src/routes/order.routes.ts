import Controller from "../controllers/order.controller";
import express from "express";

export const router = express.Router();

router.post("/", Controller.create);
