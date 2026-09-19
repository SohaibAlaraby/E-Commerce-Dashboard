import { faker } from '@faker-js/faker';
import {mockProductsData} from './mockProducts';

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  product: {
    id:number;
    name: string;
    category: string;
    thumbnail: string;
  };
  amount: number;
  paymentMethod: 'Credit Card' | 'PayPal' | 'Cash on Delivery';
  status: 'Delivered' | 'Pending' | 'Shipped' | 'Cancelled';
  date: string;
  itemsCount: number;
}

export const generateMockOrders = (count: number = 100): Order[] => {
  return Array.from({ length: count }, (_, index) => {

    const products = mockProductsData.products;
    const randomProduct = faker.helpers.arrayElement(products);

    const statuses: Order['status'][] = ['Delivered', 'Pending', 'Shipped', 'Cancelled'];
    const paymentMethods: Order['paymentMethod'][] = ['Credit Card', 'PayPal', 'Cash on Delivery'];
    return {
      id: faker.string.uuid(),
      orderNumber: `ORD-${1000 + index}`,
      customer: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
      },
      product: {
        id: randomProduct.id,
        name: randomProduct.title,
        category: randomProduct.category,
        thumbnail: randomProduct.thumbnail
      },
      amount: randomProduct.price,
      paymentMethod: faker.helpers.arrayElement(paymentMethods),
      status: faker.helpers.arrayElement(statuses),
      date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
      itemsCount: faker.number.int({ min: 1, max: 6 }),
    };
  });
};
export const mockOrdersData = generateMockOrders(100);