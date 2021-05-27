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

export default {
  create,
};
