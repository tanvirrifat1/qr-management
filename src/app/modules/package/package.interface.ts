export type IPackage = {
  name: string;
  description: string[];
  unitAmount: number;
  interval: 'month' | 'year';
  productId: string;
  priceId: string;
};
