import { ProductListType } from "./product";

export type OrderListType = {
  id: string;
  orders: OrderType[];
  createdAt: Date;
  updatedAt: Date;
};

export type OrderType = {
  id: string;
  name: string;
  productList: ProductListType;
  createdAt: Date;
  updatedAt: Date;
};
