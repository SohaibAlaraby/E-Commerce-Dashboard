import {type Order} from "@/utils/types/order.type";

export function getOrderSuccessRate(orders: Order[]): number {
  const deliveredCount = orders.filter((order) => order.status === 'Delivered').length;
  const orderCount = orders.length;
  const successRate = orderCount > 0 ? (deliveredCount / orderCount) * 100 : 0;
  return successRate;
}