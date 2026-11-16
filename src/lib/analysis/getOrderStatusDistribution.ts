import { Order } from '@/utils/types/order.type';
import { OrderStatus } from '@/utils/types/orderStatus.type';

export interface StatusDistributionItem {
  count: number;
  percentage: number;
}

export type OrderStatusDistribution = {
  [key in OrderStatus]: StatusDistributionItem;
} & {
  totalOrders: number;
};

export function getOrderStatusDistribution(orders: Order[]): OrderStatusDistribution {
  const totalOrders = orders ? orders.length : 0;

  const distribution: OrderStatusDistribution = {
    Delivered: { count: 0, percentage: 0 },
    Pending: { count: 0, percentage: 0 },
    Shipped: { count: 0, percentage: 0 },
    Cancelled: { count: 0, percentage: 0 },
    totalOrders,
  };

  if (totalOrders === 0) return distribution;

  for (const order of orders) {
    if (distribution[order.status]) {
      distribution[order.status].count += 1;
    }
  }

  const statuses: OrderStatus[] = ['Delivered', 'Pending', 'Shipped', 'Cancelled'];
  
  for (const status of statuses) {
    const count = distribution[status].count;
    distribution[status].percentage = Number(((count / totalOrders) * 100).toFixed(2));
  }

  return distribution;
}