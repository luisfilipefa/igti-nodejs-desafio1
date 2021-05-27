import { NextFunction, Request, Response } from "express";

import Services from "../services/order.service";
import formatCurrency from "../utils/formatCurrency";

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

    res.status(201).json({
      sucess: true,
      order,
    });
  } catch (err) {
    next(err);
  }
};

const updateOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body || !req.params.id) {
      return res.status(400).json({
        error: true,
        code: "properties.missing",
        message: "Order data or id not provided",
      });
    }

    if (
      typeof req.body.cliente !== "string" ||
      typeof req.body.produto !== "string" ||
      typeof req.body.valor !== "number" ||
      typeof req.body.entregue !== "boolean"
    ) {
      return res.status(400).json({
        error: true,
        code: "body.invalid",
        message: "Invalid order format",
      });
    }

    const order = await Services.updateOne(Number(req.params.id), req.body);

    if (!order) {
      return res.status(404).json({
        error: true,
        code: "info.not_found",
        message: "Order not found",
      });
    }

    res.status(200).json({
      sucess: true,
      order,
    });
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body || !req.params.id) {
      return res.status(400).json({
        error: true,
        code: "properties.missing",
        message: "Order status or id not provided",
      });
    }

    if (typeof req.body.entregue !== "boolean") {
      return res.status(400).json({
        error: true,
        code: "body.invalid",
        message: "Invalid status format",
      });
    }

    const order = await Services.updateStatus(
      Number(req.params.id),
      req.body.entregue
    );

    if (!order) {
      return res.status(404).json({
        error: true,
        code: "info.not_found",
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    next(err);
  }
};

const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({
        error: true,
        code: "properties.missing",
        message: "Id not provided",
      });
    }

    const response = await Services.deleteOne(Number(req.params.id));

    if (!response) {
      return res.status(404).json({
        error: true,
        code: "info.not_found",
        message: "Order not found",
      });
    }

    res.status(200).json({
      sucess: true,
    });
  } catch (err) {
    next(err);
  }
};

const findOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({
        error: true,
        code: "properties.missing",
        message: "Id not provided",
      });
    }

    const order = await Services.findOne(Number(req.params.id));

    if (!order) {
      return res.status(404).json({
        error: true,
        code: "info.not_found",
        message: "Order not found",
      });
    }

    res.status(200).json({
      sucess: true,
      order,
    });
  } catch (err) {
    next(err);
  }
};

const count = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        error: true,
        code: "properties.missing",
        message: "Client not provided",
      });
    }

    const total = await Services.count(req.body.cliente);

    if (!total) {
      return res.status(404).json({
        error: true,
        code: "info.not_found",
        message: "Client not found",
      });
    }

    res.status(200).json({
      sucess: true,
      count: total.totalCount,
      value: formatCurrency(total.totalValue),
    });
  } catch (err) {
    next(err);
  }
};

const metrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const metrics = await Services.metrics();

    res.status(200).json({
      sucess: true,
      metrics,
    });
  } catch (err) {
    next(err);
  }
};

const countProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        error: true,
        code: "properties.missing",
        message: "Product not provided",
      });
    }

    const total = await Services.countProducts(req.body.produto);

    if (!total) {
      return res.status(404).json({
        error: true,
        code: "info.not_found",
        message: "Product not found",
      });
    }

    res.status(200).json({
      sucess: true,
      count: total.totalCount,
      value: formatCurrency(total.totalValue),
    });
  } catch (err) {
    next(err);
  }
};

export default {
  create,
  updateOne,
  updateStatus,
  deleteOne,
  findOne,
  count,
  metrics,
  countProducts,
};
