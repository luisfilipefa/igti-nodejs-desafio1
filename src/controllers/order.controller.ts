import { NextFunction, Request, Response } from "express";

import Services from "../services/order.service";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        error: true,
        code: "body.missing",
        message: "Order not provided in body",
      });
    }

    if (
      typeof req.body.cliente !== "string" ||
      typeof req.body.produto !== "string" ||
      typeof req.body.valor !== "number"
    ) {
      return res.status(400).json({
        error: true,
        code: "body.invalid",
        message: "Invalid order format",
      });
    }

    const order = await Services.create(req.body);

    res.status(200).json({
      sucess: true,
      order,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  create,
};
