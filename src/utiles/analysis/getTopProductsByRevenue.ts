import { Product } from '../types/product.type';
import { Order } from '../types/order.type';

export interface TopProductResult {
  product: {
    id: number;
    title: string;
    category: string;
    thumbnail: string;
    price?: number;
    brand?: string;
  };
  totalQuantitySold: number;
  totalRevenue: number;      
}
export function getTopProductsByRevenue(
  orders: Order[],
  count: number,
  productsList?: Product[]
): TopProductResult[] {
  if (!orders || orders.length === 0 || count <= 0) return [];

  const statsMap = new Map<number, { totalQuantitySold: number; totalRevenue: number }>();

  for (const order of orders) {

    if (order.status === 'Cancelled') continue;

    const productId = order.product.id;
    const currentStats = statsMap.get(productId) || { totalQuantitySold: 0, totalRevenue: 0 };

    statsMap.set(productId, {
      totalQuantitySold: currentStats.totalQuantitySold + order.itemsCount,
      totalRevenue: currentStats.totalRevenue + order.amount,
    });
  }

  const productsMap = new Map<number, Product>();
  if (productsList) {
    productsList.forEach((p) => productsMap.set(p.id, p));
  }

  const results: TopProductResult[] = Array.from(statsMap.entries()).map(([id, stats]) => {
    const fullProduct = productsMap.get(id);

    return {
      product: {
        id,
        title: fullProduct ? fullProduct.title : (orders.find((o) => o.product.id === id)?.product.name || ''),
        category: fullProduct ? fullProduct.category : (orders.find((o) => o.product.id === id)?.product.category || ''),
        thumbnail: fullProduct ? fullProduct.thumbnail : (orders.find((o) => o.product.id === id)?.product.thumbnail || ''),
        price: fullProduct?.price,
        brand: fullProduct?.brand,
      },
      totalQuantitySold: stats.totalQuantitySold,
      totalRevenue: Number(stats.totalRevenue.toFixed(2)),
    };
  });

  results.sort((a, b) => b.totalRevenue - a.totalRevenue);

  return results.slice(0, count);
}