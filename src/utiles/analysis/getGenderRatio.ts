import { Customer } from '../types/customer.type';

export interface GenderRatioResult {
  male: {
    count: number;
    percentage: number;
  };
  female: {
    count: number;
    percentage: number;
  };
  totalCustomers: number;
}

export function getGenderRatio(customers: Customer[]): GenderRatioResult {
  const initialResult: GenderRatioResult = {
    male: { count: 0, percentage: 0 },
    female: { count: 0, percentage: 0 },
    totalCustomers: 0,
  };

  if (!customers || customers.length === 0) return initialResult;

  let maleCount = 0;
  let femaleCount = 0;

  for (const customer of customers) {
    if (customer.gender === 'male') {
      maleCount++;
    } else if (customer.gender === 'female') {
      femaleCount++;
    }
  }

  const total = customers.length;

  return {
    male: {
      count: maleCount,
      percentage: Number(((maleCount / total) * 100).toFixed(2)),
    },
    female: {
      count: femaleCount,
      percentage: Number(((femaleCount / total) * 100).toFixed(2)),
    },
    totalCustomers: total,
  };
}