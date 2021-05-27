export default interface IOrder {
  id: number;
  client: string;
  product: string;
  value: number;
  delivered: boolean;
  timestamp: string;
}
