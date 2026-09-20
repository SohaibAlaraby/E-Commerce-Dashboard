
import { Order } from './mockOrders';

// 1. حساب المبيعات حسب الحالات (لـ Pie Chart أو Donut Chart)
export const getStatusDistribution = (orders: Order[]) => {
  const counts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.keys(counts).map((status) => ({
    name: status,
    value: counts[status],
  }));
};

// 2. حساب إجمالي الإيرادات حسب الفئات (لـ Bar Chart)
export const getRevenueByCategory = (orders: Order[]) => {
  const revenueMap = orders.reduce((acc, order) => {
    const cat = order.product.category;
    acc[cat] = (acc[cat] || 0) + order.amount;
    return acc;
  }, {} as Record<string, number>);

  return Object.keys(revenueMap).map((category) => ({
    category,
    revenue: parseFloat(revenueMap[category].toFixed(2)),
  }));
};

//استخراج قائمة العملاء الفريدين (Unique Customers)

export const getUniqueCustomers = (orders: Order[]) => {
  const customersMap = new Map();

  orders.forEach((order) => {
    if (!customersMap.has(order.customer.email)) {
      customersMap.set(order.customer.email, {
        ...order.customer,
        totalOrders: 1,
        totalSpent: order.amount,
      });
    } else {
      const existing = customersMap.get(order.customer.email);
      existing.totalOrders += 1;
      existing.totalSpent += order.amount;
    }
  });

  return Array.from(customersMap.values());
};

// استخراج قائمة الفئات الفريدة لعمل Dropdown Filter في الجدول
export const getUniqueCategories = (orders: Order[]): string[] => {
  return Array.from(new Set(orders.map((order) => order.product.category)));
};