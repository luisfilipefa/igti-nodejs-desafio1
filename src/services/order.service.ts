import { readFile, writeFile } from "fs/promises";

import { IOrder } from "../@types/order";
import dotenv from "dotenv";

dotenv.config();

const readOrdersFile = async () => {
  const fileBuffer = await readFile(String(process.env.FILE_PATH), "utf-8");
  const file = JSON.parse(fileBuffer);
  const nextId: number = file.nextId;
  const orders: IOrder[] = file.pedidos;

  return {
    nextId,
    orders,
  };
};

const create = async (values: Partial<IOrder>) => {
  const { nextId, orders } = await readOrdersFile();

  const order: IOrder = {
    id: nextId,
    cliente: String(values.cliente),
    produto: String(values.produto),
    valor: Number(values.valor),
    entregue: false,
    timestamp: new Date().toISOString(),
  };

  const updatedOrders = {
    nextId: nextId + 1,
    pedidos: [...orders, order],
  };

  await writeFile(
    String(process.env.FILE_PATH),
    JSON.stringify(updatedOrders),
    "utf-8"
  );

  return order;
};

const updateOne = async (id: number, values: Partial<IOrder>) => {
  const { nextId, orders } = await readOrdersFile();

  const orderExists = orders.find((order) => order.id === id);

  if (!orderExists) {
    return null;
  }

  const updatedOrder = {
    ...orderExists,
    ...values,
  };

  const updatedOrders = orders.map((order) => {
    if (order.id === id) {
      return updatedOrder;
    }

    return order;
  });

  await writeFile(
    String(process.env.FILE_PATH),
    JSON.stringify({
      nextId,
      pedidos: updatedOrders,
    }),
    "utf-8"
  );

  return updatedOrder;
};

const updateStatus = async (id: number, isDelivered: boolean) => {
  const { nextId, orders } = await readOrdersFile();

  const orderExists = orders.find((order) => order.id === id);

  if (!orderExists) {
    return null;
  }

  const updatedOrder = {
    ...orderExists,
    entregue: isDelivered,
  };

  const updatedOrders = orders.map((order) => {
    if (order.id === id) {
      return updatedOrder;
    }

    return order;
  });

  await writeFile(
    String(process.env.FILE_PATH),
    JSON.stringify({
      nextId,
      pedidos: updatedOrders,
    }),
    "utf-8"
  );

  return updatedOrder;
};

const deleteOne = async (id: number) => {
  const { nextId, orders } = await readOrdersFile();

  const orderExists = orders.find((order) => order.id === id);

  if (!orderExists) {
    return null;
  }

  const updatedOrders = orders.filter((order) => order.id !== id);

  await writeFile(
    String(process.env.FILE_PATH),
    JSON.stringify({
      nextId,
      pedidos: updatedOrders,
    }),
    "utf-8"
  );

  return true;
};

const findOne = async (id: number) => {
  const { orders } = await readOrdersFile();

  const orderExists = orders.find((order) => order.id === id);

  if (!orderExists) {
    return null;
  }

  return orderExists;
};

const count = async (client: string) => {
  const { orders } = await readOrdersFile();

  const clientExists = orders.find((order) => order.cliente === client);

  if (!clientExists) {
    return null;
  }

  const total = orders.reduce(
    (acc, order) => {
      if (order.cliente === client && order.entregue) {
        acc.totalCount += 1;
        acc.totalValue += order.valor;
      }

      return acc;
    },
    { totalCount: 0, totalValue: 0 }
  );

  return { totalCount: total.totalCount, totalValue: total.totalValue };
};

const metrics = async () => {
  const { orders } = await readOrdersFile();

  const set = new Set(orders.map((order) => order.produto));

  let products = Array.from(set);

  let current = 1;

  products.forEach((p, index) => {
    orders.forEach((order) => {
      if (order.produto === p && order.entregue) {
        products[index] = `${p} - ${current++}`;
      }
    });
    current = 1;
  });

  return products.sort(
    (a, b) => Number(b.split("-")[1]) - Number(a.split("-")[1])
  );
};

const countProducts = async (product: string) => {
  const { orders } = await readOrdersFile();

  const productExists = orders.find((order) => order.produto === product);

  if (!productExists) {
    return null;
  }

  const total = orders.reduce(
    (acc, order) => {
      if (order.produto === product && order.entregue) {
        acc.totalCount += 1;
        acc.totalValue += order.valor;
      }

      return acc;
    },
    { totalCount: 0, totalValue: 0 }
  );

  return { totalCount: total.totalCount, totalValue: total.totalValue };
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
