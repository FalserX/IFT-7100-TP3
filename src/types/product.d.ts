import { ImageType } from "../types/image";
import { APIErrorMessage } from "./auth";

export type ProductType = {
  id: string;
  name: string;
  delete: boolean;
  qty?: number;
  description?: string;
  price: number;
  stock: number;
  image?: ImageType;
  userId?: string;
  createdAt: string;
  updatedAt: string;
};
export type ReadProductsResult = {
  success: boolean;
  data?: ProductType[];
  error?: APIErrorMessage;
};

export type WriteProductsResult = Pick<ReadProductsResult, "success" | "error">;
