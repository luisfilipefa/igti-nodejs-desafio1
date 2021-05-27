export interface IOrder {
  id?: number;
  cliente: string;
  produto: string;
  valor: number;
  entregue: boolean;
  timestamp: string;
}
