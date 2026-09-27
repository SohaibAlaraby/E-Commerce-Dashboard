import { type Order } from "@/utiles/types/order.type";
import { getTotalRevenue } from "./getTotalRevenue";

export function getAverageRevenue(orders: Order[]): number {
  const total = getTotalRevenue(orders);
  const orderCount = orders.length;
  const average = orderCount > 0 ? total / orderCount : 0;
  return average;
}

