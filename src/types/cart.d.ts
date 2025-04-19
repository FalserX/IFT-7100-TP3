import { ProductListType } from "./product";
import { v4 as uuid } from "uuid";

export type Cart = {
  id: typeof uuid;
  productList: ProductListType;
  createdAt: Date;
  updatedAt: Date;
};
