import { type Order } from "@/utiles/types/order.type";

export function getTotalOrders(orders: Order[]): number {
  return orders.length;
}
