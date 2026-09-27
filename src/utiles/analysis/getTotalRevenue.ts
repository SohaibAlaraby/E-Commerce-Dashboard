import { type Order } from "@/utiles/types/order.type";

export function getTotalRevenue(orders: Order[]): number {
    return orders.reduce((total, order) => total + (order.amount * order.itemsCount), 0);
}
