import { type Order } from "@/utils/types/order.type";

export function getTotalOrders(orders: Order[]): number {
  return orders.length;
}
