import { type Order } from "@/utils/types/order.type";
export interface CategoryRevenueShare {
  category: string;
  revenue: number;
  percentage: number;
}

export function getCategoryRevenueShare(
  orders: Order[]
): CategoryRevenueShare[] {
  if (!orders || orders.length === 0) return [];
  let totalRevenue = 0;
  const categoryRevenueMap: Record<string, number> = {};

  for (const order of orders) {
    if (order.status === 'Cancelled') continue;
    const { category } = order.product;
    const amount = order.amount * order.itemsCount;

    totalRevenue += amount;
    categoryRevenueMap[category] = (categoryRevenueMap[category] || 0) + amount;
  }

  if (totalRevenue === 0) return [];

  return Object.entries(categoryRevenueMap).map(([category, revenue]) => {
    const percentage = Number(((revenue / totalRevenue) * 100).toFixed(2));

    return {
      category,
      revenue,
      percentage,
    };
  });
}