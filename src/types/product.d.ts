export type ProductType = {
  id: string;
  name: string;
  delete?: boolean;
  qty?: number;
  description?: string;
  price: number;
  stock: number;
  seller?: string;
  createdAt?: string;
  updatedAt?: string;
};
