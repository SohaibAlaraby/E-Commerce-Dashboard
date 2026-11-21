import { faker } from '@faker-js/faker';
import {ProductsData} from './Products';
import { Customers } from './Customers';
import {type Order } from '@/utils/types/order.type';
import { type OrderStatus } from '@/utils/types/orderStatus.type';

export const generateMockOrders = (count: number = 100): Order[] => {
  return Array.from({ length: count }, (_, index) => {

    const products = ProductsData.products;
    const randomProduct = faker.helpers.arrayElement(products);

    const users = Customers;
    const randomUser = faker.helpers.arrayElement(users);

    const statuses: Order['status'][] = ['Delivered', 'Pending', 'Shipped', 'Cancelled'];
    const paymentMethods: Order['paymentMethod'][] = ['Credit Card', 'PayPal', 'Cash on Delivery'];
    return {
      id: faker.string.uuid(),
      orderNumber: `ORD-${1000 + index}`,
      customer: {
        name: randomUser.firstName + ' ' + randomUser.lastName,
        email: randomUser.email,
        avatar: randomUser.image,
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
      createdAt: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
      itemsCount: faker.number.int({ min: 1, max: 6 }),
    };
  });
};
export const mockOrdersData = generateMockOrders(100);