import { type Order } from "@/utiles/types/order.type";

export interface CategoryAvgPrice {
  category: string;
  avgPrice: number;
  totalOrdersCount: number;
}

export function getCategoryAveragePrice(orders: Order[]): CategoryAvgPrice[] {
    if (!orders || orders.length === 0) return [];

  const categoryStatsMap = new Map<
    string,
    { totalAmount: number; count: number }
  >();

  for (const order of orders) {

    if (order.status === 'Cancelled') continue;

    const category = order.product.category;
    const current = categoryStatsMap.get(category) || {
      totalAmount: 0,
      count: 0,
    };

    categoryStatsMap.set(category, {
      totalAmount: current.totalAmount + order.amount,
      count: current.count + 1,
    });
  }

  const result: CategoryAvgPrice[] = [];

  categoryStatsMap.forEach((stats, category) => {
    const avgPrice = Number((stats.totalAmount / stats.count).toFixed(2));

    result.push({
      category,
      avgPrice,
      totalOrdersCount: stats.count,
    });
  });

  return result;
}