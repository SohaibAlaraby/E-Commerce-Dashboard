import { type OrderStatus } from "./orderStatus.type";
import { type OrderPaymentMethods } from "./orderPaymentMethods.type";


export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  product: {
    id:number;
    name: string;
    category: string;
    thumbnail: string;
  };
  amount: number;
  paymentMethod: OrderPaymentMethods;
  status: OrderStatus;
  date: string;
  itemsCount: number;
}