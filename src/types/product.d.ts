import { v4 as uuid } from "uuid";
import { ImageType } from "../types/image";

export type ProductListType = {
  id: typeof uuid;
  products: ProductType[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductType = {
  id: typeof uuid;
  name: string;
  qty: number;
  description?: string;
  price: number;
  stock: number;
  image?: ImageType;
  createdAt: Date;
  updatedAt: Date;
};
